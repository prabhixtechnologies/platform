# Marketing BFF — oneOps counterpart changes

## Public BFF credential (aligned)

When oneOps has `prabhix.security.public-bff-credential` set, server-side marketing calls that
lack a browser `Origin` must send header `X-Prabhix-Public-Bff` with the same value.

Marketing reads **`PRABHIX_PUBLIC_BFF_CREDENTIAL`** (server-only, never `NEXT_PUBLIC_*`). Production
startup fails closed if it is missing (`src/instrumentation.ts`). All server/BFF upstream calls for
visitor, chat, commerce, and site public APIs go through `fetchPublicUpstream`.

---

Platform marketing already calls these endpoints the secure way. Deploy chat SSE without the
oneOps change below and visitor streams will fail to connect (401/403 from upstream).

## Chat public SSE (`EDGE` / security remediation)

**Today (oneOps):** `GET /api/v1/oneops/chat/public/stream` requires `token` as a query parameter.

**Marketing BFF (this repo):** `src/app/api/chat/stream/route.ts` proxies browser `EventSource`
traffic using the httpOnly `pbx_chat` cookie and calls upstream with:

- Query: `organizationId`, `conversationId` only (no JWT in the query string).
- Header: `X-Chat-Token: <conversation JWT>` (same header as other public chat APIs).

**Required oneOps change:** Update `ChatStreamController.streamVisitor` to accept the conversation
token from `X-Chat-Token` (required) and stop requiring `token` in the query string. Optional
transition: accept header first, fall back to query for one release, then remove query support.

Suggested signature:

```java
@GetMapping(value = "/public/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamVisitor(
    @RequestParam UUID organizationId,
    @RequestParam UUID conversationId,
    @RequestHeader("X-Chat-Token") String token) {
    return hub.subscribeVisitor(organizationId, conversationId, token);
}
```

Regenerate OpenAPI (`streamVisitor` should document `X-Chat-Token`, not `token` query param).

## Already aligned (no oneOps change)

- Public chat REST uses `X-Chat-Token` (messages, send, attachments).
- Commerce cart/order tokens are validated via existing public cart/order GET APIs before Set-Cookie.
