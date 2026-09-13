"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { z } from "zod";
import { fetchMessages, sendMessage, startConversation } from "@/lib/chat/chat-client";
import { migrateLegacyChatToken, readChatSession, writeChatSession } from "@/lib/chat/storage";
import { ChatStream } from "@/lib/chat/stream";
import type { ConnectionState, MessageView } from "@/lib/chat/types";
import type { PublicChatSession } from "@/lib/chat/storage";
import { getVisitorKeyForChat } from "@/lib/visitor/api";
import { trapTab } from "@/lib/focus-trap";
import { cn } from "@/lib/utils";

const preChatSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(500).optional(),
});

type ChatWidgetProps = {
  enabled: boolean;
};

export function ChatWidget({ enabled }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<PublicChatSession | null>(null);
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [unread, setUnread] = useState(0);
  const [agentTyping, setAgentTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [preChat, setPreChat] = useState({ name: "", email: "", subject: "" });

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ChatStream | null>(null);
  const knownIds = useRef(new Set<string>());
  const titleId = useId();
  const descId = useId();

  const loadHistory = useCallback(async (active: PublicChatSession) => {
    const page = await fetchMessages(active.conversationId);
    if (!page?.items) return [];
    const sorted = [...page.items].sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    );
    for (const item of sorted) {
      knownIds.current.add(item.id);
    }
    setMessages(sorted);
    return sorted;
  }, []);

  const pollNewMessages = useCallback(async (): Promise<MessageView[]> => {
    if (!session) return [];
    const page = await fetchMessages(
      session.conversationId,
    );
    if (!page?.items) return [];
    const fresh = page.items.filter((item) => !knownIds.current.has(item.id));
    return fresh.sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    );
  }, [session]);

  const appendMessage = useCallback(
    (message: MessageView) => {
      if (knownIds.current.has(message.id)) return;
      knownIds.current.add(message.id);
      setMessages((prev) => {
        const next = [...prev, message];
        return next.sort(
          (a, b) =>
            new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
        );
      });
      if (!open && message.senderType === "AGENT") {
        setUnread((count) => count + 1);
      }
    },
    [open],
  );

  const startStream = useCallback(
    (active: PublicChatSession) => {
      streamRef.current?.disconnect();
      streamRef.current = new ChatStream(
        active.conversationId,
        {
          onMessage: appendMessage,
          onTyping: setAgentTyping,
          onAgentsAvailable: (available) => {
            setSession((prev) =>
              prev ? { ...prev, agentsAvailable: available } : prev,
            );
          },
          onStateChange: setConnectionState,
        },
        pollNewMessages,
      );
      streamRef.current.connect();
    },
    [appendMessage, pollNewMessages],
  );

  useEffect(() => {
    if (!enabled) return;
    void migrateLegacyChatToken().then(() => {
      const stored = readChatSession();
      if (stored) {
        setSession(stored);
        void loadHistory(stored).then(() => startStream(stored));
      }
    });
    return () => {
      streamRef.current?.disconnect();
    };
  }, [enabled, loadHistory, startStream]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, button:not([disabled])",
    );
    focusable?.focus();
  }, [open, session]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        launcherRef.current?.focus();
        return;
      }
      if (panelRef.current) trapTab(panelRef.current, event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handlePreChatSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = preChatSchema.safeParse(preChat);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (msgs?.[0]) errors[key] = msgs[0];
      }
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setStarting(true);
    try {
      const response = await startConversation({
        ...parsed.data,
        visitorKey: getVisitorKeyForChat() ?? undefined,
      });
      if (!response) {
        setFormErrors({ form: "Unable to start chat. Please try again." });
        return;
      }
      const nextSession: PublicChatSession = {
        conversationId: response.conversationId,
        name: parsed.data.name,
        email: parsed.data.email,
        agentsAvailable: response.agentsAvailable,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      writeChatSession(nextSession);
      setSession(nextSession);
      knownIds.current.clear();
      setMessages([]);
      await loadHistory(nextSession);
      startStream(nextSession);
    } finally {
      setStarting(false);
    }
  }

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!session || !draft.trim() || sending) return;
    const body = draft.trim();
    setDraft("");
    setSending(true);
    try {
      const sent = await sendMessage(
        session.conversationId,
        { body },
      );
      if (sent) {
        appendMessage(sent);
      }
    } finally {
      setSending(false);
    }
  }

  if (!enabled) return null;

  const agentsAvailable = session?.agentsAvailable ?? true;
  const statusLabel =
    connectionState === "live"
      ? "Live"
      : connectionState === "polling"
        ? "Updating periodically"
        : connectionState === "connecting"
          ? "Connecting…"
          : connectionState === "offline"
            ? "Offline"
            : "Ready";

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-ink/40 transition-opacity sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "fixed z-[80] flex flex-col border border-border bg-background shadow-2xl transition-transform duration-200",
          "inset-x-0 bottom-0 max-h-[100dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom,0px)]",
          "sm:inset-x-auto sm:bottom-24 sm:right-4 sm:h-[min(560px,calc(100dvh-7rem))] sm:w-[min(400px,calc(100vw-2rem))] sm:rounded-2xl",
          open
            ? "translate-y-0 sm:scale-100 sm:opacity-100"
            : "pointer-events-none translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-foreground">
              Chat with us
            </h2>
            <p id={descId} className="mt-0.5 text-xs text-muted-foreground">
              {agentsAvailable
                ? "We typically reply within a few minutes."
                : "Our team is away — leave a message and we'll email you back."}
            </p>
            <p className="mt-1 text-[11px] text-muted" aria-live="polite">
              {statusLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              launcherRef.current?.focus();
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        {!session ? (
          <form
            onSubmit={handlePreChatSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
          >
            <PreChatField
              label="Name"
              name="name"
              value={preChat.name}
              onChange={(value) => setPreChat((prev) => ({ ...prev, name: value }))}
              error={formErrors.name}
              required
            />
            <PreChatField
              label="Email"
              name="email"
              type="email"
              value={preChat.email}
              onChange={(value) =>
                setPreChat((prev) => ({ ...prev, email: value }))
              }
              error={formErrors.email}
              required
            />
            <PreChatField
              label="Subject (optional)"
              name="subject"
              value={preChat.subject}
              onChange={(value) =>
                setPreChat((prev) => ({ ...prev, subject: value }))
              }
              error={formErrors.subject}
            />
            {formErrors.form && (
              <p className="text-sm text-red-500" role="alert">
                {formErrors.form}
              </p>
            )}
            <button
              type="submit"
              disabled={starting}
              className="mt-auto h-11 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-strong disabled:opacity-50"
            >
              {starting ? "Starting…" : "Start chat"}
            </button>
          </form>
        ) : (
          <>
            <div
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Say hello — a team member will join shortly.
                </p>
              )}
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {agentTyping && (
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  Agent is typing…
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
            >
              <div className="flex items-end gap-2">
                <label htmlFor="chat-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="chat-message"
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type your message…"
                  className="max-h-32 min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-strong disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="size-4" aria-hidden />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "fixed z-[75] flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:bg-primary-strong",
          "bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]",
          "sm:bottom-6 sm:right-6",
        )}
        aria-expanded={open}
        aria-controls={titleId}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="size-6" aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </>
  );
}

function MessageBubble({ message }: { message: MessageView }) {
  const isVisitor = message.senderType === "VISITOR";
  const isSystem = message.senderType === "SYSTEM";

  if (isSystem) {
    return (
      <p className="text-center text-xs text-muted-foreground">{message.body}</p>
    );
  }

  return (
    <div className={cn("flex", isVisitor ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          isVisitor
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md border border-border bg-surface text-foreground",
        )}
      >
        {message.body}
      </div>
    </div>
  );
}

function PreChatField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  const id = `chat-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
