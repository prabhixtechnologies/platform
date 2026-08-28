export type ConversationStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";

export type StartConversationResponse = {
  conversationId: string;
  conversationToken: string;
  status: ConversationStatus;
  agentsAvailable: boolean;
};

export type PreChatRequest = {
  name: string;
  email: string;
  subject?: string;
  visitorKey?: string;
};

export type MessageView = {
  id: string;
  senderType: "VISITOR" | "AGENT" | "SYSTEM" | "NOTE";
  senderUserId?: string;
  body: string;
  fileId?: string;
  occurredAt: string;
};

export type MessagePage = {
  items: MessageView[];
  nextCursor?: string;
  hasMore?: boolean;
};

export type SendMessageRequest = {
  body: string;
};

export type ConnectionState =
  | "idle"
  | "connecting"
  | "live"
  | "polling"
  | "offline";

export type StoredChatSession = {
  conversationId: string;
  conversationToken: string;
  name: string;
  email: string;
  agentsAvailable: boolean;
  expiresAt: number;
};
