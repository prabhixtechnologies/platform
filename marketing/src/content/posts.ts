export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "multi-tenant-isolation-three-layers",
    title: "Multi-tenant isolation: why we enforce it three times",
    excerpt:
      "Shared-schema multi-tenancy is the right trade-off for 100k-user organizations — but only if isolation is redundant, not optional.",
    author: "Prabhix Engineering",
    date: "2025-07-14",
    readTime: "8 min",
    tags: ["Architecture", "Security", "Multi-tenancy"],
    content: [
      "When we designed the Prabhix platform, we chose shared-schema multi-tenancy over schema-per-tenant. The reason is operational: a single organization may grow to 100,000 users, and per-schema designs make connection pooling, online migrations, and index management painful at that scale.",
      "But shared schema means every query is a potential cross-tenant leak if you get lazy. We enforce isolation in three deliberately redundant layers:",
      "**Layer 1 — JWT claims.** Every access token carries the active organization ID (`org`). The API rejects requests where the claimed org doesn't match the resource being accessed.",
      "**Layer 2 — TenantFilter.** A servlet filter resolves the org claim into a request-scoped `TenantContext`. Before any business logic runs, the filter validates that the authenticated user is actually a member of that organization. A missing or invalid tenant context throws — it never silently defaults.",
      "**Layer 3 — Hibernate filter.** All tenant-scoped entities extend `TenantScopedEntity`, which registers a Hibernate `@FilterDef` that appends `organization_id = :orgId` to every query automatically. Even if a developer forgets a WHERE clause, the ORM won't return another tenant's rows.",
      "On top of this, we enable Postgres Row-Level Security on the highest-risk tables — `mail_messages`, `mail_threads`, and `billing_invoices` — as a defence-in-depth backstop.",
      "The redundancy is intentional. Any single layer can fail during a refactor or a rushed feature. Three layers mean a bug has to survive three independent checks before it becomes a data breach.",
      "**Practical takeaway:** if you're building multi-tenant SaaS, don't rely on convention ('we always add org_id to queries'). Encode isolation in infrastructure — filters, ORM hooks, and database policies — so correctness doesn't depend on every developer remembering every time.",
    ],
  },
  {
    slug: "razorpay-webhooks-source-of-truth",
    title: "Why Razorpay webhooks — not browser callbacks — are our billing source of truth",
    excerpt:
      "Browser return URLs are unreliable. Here's how we close the payment verification gap with idempotent webhook processing.",
    author: "Prabhix Engineering",
    date: "2025-06-28",
    readTime: "6 min",
    tags: ["Billing", "Razorpay", "Reliability"],
    content: [
      "Payment flows have a classic failure mode: the user pays successfully, closes the browser tab before the redirect completes, and your system never records the payment. The user is charged; your database says 'pending'. Support tickets follow.",
      "Our billing module treats Razorpay webhooks as the single source of truth for payment state — not the browser callback.",
      "**Order creation is server-side only.** Amounts, plan IDs, and seat counts are computed on the server from the organization's subscription record. The client never sends a price.",
      "**Browser callback verifies signatures but doesn't mutate state.** When the user returns from Razorpay's checkout, we verify `HMAC-SHA256(order_id|payment_id, secret)` and show a confirmation UI. But we don't activate entitlements from this path alone.",
      "**Webhooks drive state transitions.** Every Razorpay webhook hits `POST /api/v1/billing/webhooks/razorpay`. We verify `X-Razorpay-Signature` against the webhook secret, persist the raw payload to an `webhook_events` table, and process it idempotently on `event.id`.",
      "This pattern closes three gaps:",
      "1. **Lost redirects** — the webhook arrives regardless of browser behaviour.",
      "2. **Duplicate processing** — idempotency on `event.id` means retries are safe.",
      "3. **Audit trail** — raw webhook payloads are retained for dispute resolution and debugging.",
      "Entitlements (feature flags, seat limits) are updated only after webhook-confirmed payment. The UI may show 'processing' for a few seconds after checkout — that's intentional. Correctness beats instant gratification.",
    ],
  },
  {
    slug: "offline-first-mobile-sync-patterns",
    title: "Offline-first sync patterns we use in MobiStack",
    excerpt:
      "Repair shop technicians can't wait for Wi-Fi. Here's how MobiStack handles offline ticket creation, inventory lookups, and conflict resolution.",
    author: "Prabhix Engineering",
    date: "2025-08-05",
    readTime: "7 min",
    tags: ["Mobile", "MobiStack", "Offline-first"],
    content: [
      "MobiStack's technician app is used on shop floors where connectivity is inconsistent — basement service counters, crowded malls, shared shop Wi-Fi that drops under load. 'Online-only' wasn't an option.",
      "We built the mobile client with an offline-first architecture using a local SQLite store as the read/write surface, with background sync to the Prabhix API when connectivity is available.",
      "**Write locally, sync later.** Ticket creation, status updates, and inventory adjustments write to the local database immediately. The UI reflects the change instantly. A sync queue batches mutations and sends them to the API with exponential backoff on failure.",
      "**Conflict resolution by domain.** Not every conflict can be 'last write wins':",
      "- **Ticket status** — server wins on conflict; the technician sees a toast explaining the current server state.",
      "- **Inventory counts** — optimistic locking with version numbers; conflicts surface a merge UI for the shop manager.",
      "- **Customer notes** — append-only; both local and server notes are preserved and deduplicated by timestamp.",
      "**Part compatibility cache.** The compatibility engine data for supported device families is pre-synced to the device during login. Technicians can look up compatible parts offline; the cache refreshes on each successful sync.",
      "**Sync indicators.** The app shows a subtle status bar: synced, syncing, or offline with N pending changes. Technicians trust the app because it never silently drops their work.",
      "These patterns aren't unique to repair shops — any field-work application with unreliable connectivity benefits from the same approach: local-first writes, domain-specific conflict rules, and transparent sync status.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
