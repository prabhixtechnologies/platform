export type ChatErrorBody = {
  code?: string;
  message: string;
  retryAfterSeconds?: number;
};

export class ChatBffError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryAfterSeconds?: number;

  constructor(status: number, body: ChatErrorBody) {
    super(body.message);
    this.name = "ChatBffError";
    this.status = status;
    this.code = body.code ?? "UNKNOWN";
    this.retryAfterSeconds = body.retryAfterSeconds;
  }
}

const FRIENDLY: Record<string, string> = {
  TOKEN_EXPIRED: "Your chat session expired. Start a new conversation.",
  TOKEN_INVALID: "Your chat session is no longer valid. Start a new conversation.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  ORIGIN_NOT_ALLOWED: "Chat is unavailable from this site.",
  NO_SESSION: "Your chat session expired. Start a new conversation.",
};

export function friendlyChatError(err: unknown): string {
  if (err instanceof ChatBffError) {
    if (err.code === "RATE_LIMITED" && err.retryAfterSeconds) {
      return `Too many requests. Try again in about ${err.retryAfterSeconds} seconds.`;
    }
    return FRIENDLY[err.code] ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
