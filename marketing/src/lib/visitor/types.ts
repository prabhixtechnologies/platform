export type ConsentLevel = "FULL" | "MINIMAL" | "DELETED";

export type PageViewInput = {
  url: string;
  path: string;
  title?: string;
  referrer?: string;
  durationMs?: number;
  entry?: boolean;
  exit?: boolean;
};

export type CustomEventInput = {
  name: string;
  properties?: Record<string, unknown>;
};

export type SessionContext = {
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  timezone?: string;
};

export type PresenceUpdate = {
  url: string;
  path: string;
  title?: string;
};

export type BatchIngestRequest = {
  consent: ConsentLevel;
  visitorKey?: string;
  sessionId?: string;
  pageViews?: PageViewInput[];
  events?: CustomEventInput[];
  session?: SessionContext;
  utm?: Record<string, string>;
  referrer?: string;
  presence?: PresenceUpdate;
};

export type IngestAck = {
  visitorKey?: string;
  sessionId?: string;
};

export type IdentifyRequest = {
  visitorKey?: string;
  name?: string;
  email?: string;
};
