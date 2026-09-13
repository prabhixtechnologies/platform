import { siteConfig } from "@/lib/site-config";
import { chatStreamUrl } from "./chat-client";
import type { ConnectionState, MessageView } from "./types";

export type StreamHandlers = {
  onMessage: (message: MessageView) => void;
  onTyping?: (typing: boolean) => void;
  onAgentsAvailable?: (available: boolean) => void;
  onStateChange: (state: ConnectionState) => void;
};

type ParsedSsePayload = {
  type?: string;
  message?: MessageView;
  typing?: boolean;
  agentsAvailable?: boolean;
};

export class ChatStream {
  private source: EventSource | null = null;
  private retryAttempt = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private closed = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastMessageAt: string | null = null;
  private polling = false;

  constructor(
    private conversationId: string,
    private handlers: StreamHandlers,
    private pollFn: () => Promise<MessageView[]>,
  ) {}

  connect(): void {
    if (this.closed) return;
    this.closeSource();
    const url = chatStreamUrl(this.conversationId);
    if (!url || !siteConfig.orgId) {
      this.handlers.onStateChange("polling");
      this.startPolling();
      return;
    }

    this.handlers.onStateChange("connecting");
    try {
      this.source = new EventSource(url);
    } catch {
      this.fallbackToPolling();
      return;
    }

    this.source.onopen = () => {
      this.retryAttempt = 0;
      this.handlers.onStateChange("live");
      this.stopPolling();
    };

    this.source.onmessage = (event) => {
      this.handlePayload(event.data);
    };

    this.source.addEventListener("message", (event) => {
      this.handlePayload((event as MessageEvent).data);
    });

    this.source.addEventListener("typing", (event) => {
      const data = safeParsePayload((event as MessageEvent).data);
      if (data && "typing" in data && typeof data.typing === "boolean") {
        this.handlers.onTyping?.(data.typing);
      }
    });

    this.source.onerror = () => {
      this.closeSource();
      if (this.closed) return;
      this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.closed = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.closeSource();
    this.stopPolling();
    this.handlers.onStateChange("idle");
  }

  private closeSource(): void {
    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.closed) return;
    if (this.retryAttempt >= 3) {
      this.fallbackToPolling();
      return;
    }
    const delay = Math.min(30_000, 1_000 * 2 ** this.retryAttempt);
    this.retryAttempt += 1;
    this.handlers.onStateChange("connecting");
    this.retryTimer = setTimeout(() => {
      void this.waitUntilVisible().then(() => {
        if (!this.closed) this.connect();
      });
    }, delay);
  }

  private waitUntilVisible(): Promise<void> {
    if (typeof document === "undefined" || !document.hidden) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const onVisible = () => {
        if (!document.hidden) {
          document.removeEventListener("visibilitychange", onVisible);
          resolve();
        }
      };
      document.addEventListener("visibilitychange", onVisible);
    });
  }

  private fallbackToPolling(): void {
    this.handlers.onStateChange("polling");
    this.startPolling();
  }

  private startPolling(): void {
    if (this.pollTimer || this.polling) return;
    this.polling = true;
    void this.pollOnce();
    this.pollTimer = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      void this.pollOnce();
    }, 5_000);
  }

  private stopPolling(): void {
    this.polling = false;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async pollOnce(): Promise<void> {
    try {
      const messages = await this.pollFn();
      for (const message of messages) {
        if (
          !this.lastMessageAt ||
          message.occurredAt > this.lastMessageAt
        ) {
          this.handlers.onMessage(message);
          this.lastMessageAt = message.occurredAt;
        }
      }
      if (!this.closed) {
        this.handlers.onStateChange(this.source ? "live" : "polling");
      }
    } catch {
      if (!this.closed) {
        this.handlers.onStateChange("offline");
      }
    }
  }

  private handlePayload(raw: string): void {
    const data = safeParsePayload(raw);
    if (!data) return;

    if ("message" in data && data.message) {
      this.handlers.onMessage(data.message);
      this.lastMessageAt = data.message.occurredAt;
      return;
    }

    if ("type" in data && data.type === "typing" && typeof data.typing === "boolean") {
      this.handlers.onTyping?.(data.typing);
      return;
    }

    if ("agentsAvailable" in data && typeof data.agentsAvailable === "boolean") {
      this.handlers.onAgentsAvailable?.(data.agentsAvailable);
      return;
    }

    if (
      "id" in data &&
      "body" in data &&
      "senderType" in data &&
      "occurredAt" in data
    ) {
      const message = data as MessageView;
      this.handlers.onMessage(message);
      this.lastMessageAt = message.occurredAt;
    }
  }
}

function safeParsePayload(raw: string): ParsedSsePayload | MessageView | null {
  try {
    return JSON.parse(raw) as ParsedSsePayload | MessageView;
  } catch {
    return null;
  }
}
