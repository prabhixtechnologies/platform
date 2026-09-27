export type ChatJwtPayload = {
  org?: string;
  conv?: string;
  vis?: string;
};

/** Reads unsigned JWT claims to locate the conversation id for upstream validation. */
export function readChatJwtPayload(token: string): ChatJwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Record<string, unknown>;
    return {
      org: typeof parsed.org === "string" ? parsed.org : undefined,
      conv: typeof parsed.conv === "string" ? parsed.conv : undefined,
      vis: typeof parsed.vis === "string" ? parsed.vis : undefined,
    };
  } catch {
    return null;
  }
}
