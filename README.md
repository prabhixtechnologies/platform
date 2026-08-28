# Prabhix Platform

> **PRABHIX** — Progressive Research & Automation Business Hub for Innovation & eXperience
> _Building software that simplifies business._

A multi-tenant enterprise platform: the public site for **Prabhix Technologies**, plus a SaaS
product where each customer organization gets an isolated workspace with a shared email
helpdesk, self-hosted mail infrastructure, Razorpay billing, and fine-grained RBAC. Designed
so a single organization can hold **100,000 users**.

---

## What is in here

| Directory | What it is | Stack |
|---|---|---|
| `backend/` | The API and all business logic | Java 21 · Spring Boot 3.5 · PostgreSQL 16 · Redis 7 · Flyway |
| `web/` | Authenticated customer console | React 19 · Vite 7 · Tailwind 4 · shadcn/ui · TanStack Query |
| `marketing/` | Public website | Next.js 15 · React 19 · Tailwind 4 |
| `mail-server/` | Self-hosted mail transport | Postfix · Dovecot · Rspamd |
| `deploy/` | Production deployment | Caddy · Docker · EC2 scripts · runbook |
| `docs/` | Architecture and design | — |

### Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — module layout, multi-tenancy, RBAC,
  and the specific decisions that make 100k users per tenant work.
- **[docs/MAIL.md](docs/MAIL.md)** — the three-layer email subsystem in detail.
- **[mail-server/README.md](mail-server/README.md)** — mail operations runbook, including
  DNS, deliverability, and the AWS port 25 problem.
- **[deploy/RUNBOOK.md](deploy/RUNBOOK.md)** — deploy, roll back, restore, rotate secrets.

---

## Quick start

### Everything in Docker

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

This runs all seven services as containers — `postgres`, `pgbouncer`, `redis`, `mailpit`,
`backend`, `web`, `marketing`. Nothing needs to run on the host.

Before the first build, copy `.env.example` to `.env` and set `NEXT_PUBLIC_ORG_SLUG` and
`NEXT_PUBLIC_ORG_ID` to the organization created by `backend/seed-demo.ps1`. Next inlines
`NEXT_PUBLIC_*` at **build** time, so a missing slug cannot be corrected by restarting the
container — and it fails silently, serving a site with no storefront, chat widget or visitor
beacon rather than an error. Rebuild marketing after changing either value.

| Service | URL | In production |
|---|---|---|
| Marketing site | http://localhost:3000 | `prabhixtechnologies.com` |
| OneOps console | http://localhost:5173 | `oneops.prabhixtechnologies.com` |
| API | http://localhost:8080 | `api.prabhixtechnologies.com` |
| API docs (Swagger) | http://localhost:8080/swagger-ui.html | disabled in prod |
| Mail catcher (Mailpit) | http://localhost:8025 | not deployed |

Run the marketing site on **3000** specifically. The visitor beacon, chat widget and storefront
are public endpoints guarded by an `Origin` allowlist that defaults to `http://localhost:3000`, so
on a fallback port every public call returns 403.

From the marketing site, OneOps is reachable via **Sign in** in the header, or
Products → OneOps → Open OneOps.

Every email the platform sends lands in Mailpit locally, so you can click a magic link or
read an invoice without configuring a mail provider.

### Running pieces natively

The backend targets Java 21 for production (it enables virtual threads), but nothing in the
code needs 21 to compile. On a JDK 17 machine:

```bash
cd backend
mvn -Djava.version=17 spring-boot:run     # needs Postgres + Redis running
mvn -Djava.version=17 test                # unit tests, no containers needed
```

```bash
cd web && npm install && npm run dev          # console on :5173
cd marketing && npm install && npm run dev    # site on :3000
```

Both dev servers need the API running — there is no offline/fixture mode, so start Postgres,
Redis and the backend first. Native mode is for hot reload; prefer the all-Docker command above
if you just want the stack up.

---

## Architecture at a glance

```
                    ┌──────────────┐   ┌──────────────┐
   prabhix...com ──►│  marketing   │   │     web      │◄── app.prabhix...com
                    │  (Next.js)   │   │ (React+Vite) │
                    └──────┬───────┘   └───────┬──────┘
                           └─────────┬─────────┘
                                     ▼
                        ┌────────────────────────┐
   api.prabhix...com ──►│  backend  (Spring Boot)│
                        │  modular monolith      │
                        │  auth · org · mail ·   │
                        │  billing · site · audit│
                        └───┬────────┬───────┬───┘
                            ▼        ▼       ▼
                     PostgreSQL   Redis    S3
                            ▲
                            │ pgsql recipient maps
                    ┌───────┴────────┐
   mail.prabhix...──│ Postfix·Dovecot│
        (MX)        │    ·Rspamd     │
                    └────────────────┘
```

A **modular monolith**, not microservices. Modules are strictly separated — they talk through
published interfaces and domain events (`common/event/`), never by reaching into each other's
`domain/` or `repository/` packages — so any of them can be extracted into its own service
later without a rewrite. One deployable is the right call at this stage; the boundaries are
drawn so it does not have to stay that way.

### Multi-tenancy

Shared schema with an `organization_id` discriminator, isolated in three redundant layers:

1. The JWT carries the active organization.
2. `TenantFilter` resolves and validates it into a request-scoped `TenantContext`.
3. A **Hibernate filter** appends `organization_id = :orgId` to every query against a
   `TenantScopedEntity` automatically — so it is structurally impossible to forget the
   `where` clause, rather than merely conventional to remember it.

Row-level security is additionally enabled on the highest-risk tables as a backstop.

### Authorization

Code authorizes on **permissions**, never on roles. Roles are bundles customers can reshape;
permissions are the fixed vocabulary. Six system roles are seeded (`OWNER`, `ADMIN`,
`MANAGER`, `AGENT`, `MEMBER`, `VIEWER`) and organizations can define their own on top.

Permissions are resolved once at token issue and embedded in the JWT, because a permission
lookup per request would be the busiest query in the system at scale. A Redis deny-list
handles revocations that must take effect before the 15-minute token TTL expires.

### Email

Three layers, each usable alone — see [docs/MAIL.md](docs/MAIL.md):

1. **Transport** — self-hosted Postfix/Dovecot/Rspamd owning MX for customer domains, with
   DKIM signing and per-domain DNS verification. Optional: `EXTERNAL_IMAP` mode keeps mail at
   Google Workspace or Zoho and only pulls from it.
2. **Shared inbox** — IMAP or LMTP ingestion, MIME parsing, conversation threading, rule-based
   routing, assignment, SLA timers on business hours, internal notes, and presence so two
   agents do not reply to the same customer.
3. **Transactional engine** — database-backed templates, an outbox with retry and provider
   failover, suppression lists, and opt-in open/click tracking.

Two invariants worth knowing: ingestion is idempotent on `Message-ID`, and **nothing sends
inside a request transaction** — services write to `mail_outbox` and a worker drains it, so a
provider outage is a delay rather than a failed user action.

### Payments

Razorpay, INR-first, with full lifecycle: orders, subscriptions, seat proration, refunds,
gapless GST-compliant invoice numbering, and dunning on failed renewals.

**Webhooks are the source of truth for payment state, not the browser callback.** Every
webhook is signature-verified against the raw body, persisted before processing, and
processed idempotently on the event id. Order amounts are always computed server-side.

---

## Repository conventions

- **Java** — records for DTOs (grouped in `<Area>Dtos.java`), Lombok constructor injection,
  `@Transactional` on services only, `ApiException` + `ErrorCode` for every expected failure.
- **TypeScript** — `strict`, Zod at every API boundary, TanStack Query for server state,
  path alias `@/*`.
- **SQL** — Flyway forward-only, `ddl-auto: validate` so the schema is never guessed from
  entities, every foreign key explicitly indexed, cursor pagination instead of `OFFSET`.
- **Comments** explain business rules and trade-offs. They never narrate the code.

Full detail in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §9.

---

## Testing

```bash
cd backend && mvn -Djava.version=17 test          # 230 unit tests (@Tag("integration") excluded)
cd backend && mvn -Djava.version=17 test -Pintegration   # 232 tests (+ Testcontainers; needs Docker)
cd web && npx tsc --noEmit && npm run build
cd marketing && npx tsc --noEmit && npm run build
```

Integration tests start ephemeral `postgres:16-alpine` and `redis:7-alpine` containers (matching
`docker-compose.yml`), run the full Flyway migration set from empty, boot the app with
`ddl-auto: validate`, and assert tenant-scoped reads against real Hibernate filters. On Windows
Docker Desktop, `backend/src/test/resources/testcontainers.properties` points Testcontainers at
the Linux engine pipe.

CI runs all four on every push (`.github/workflows/ci.yml`) and publishes Docker images on
merge to `main`.

---

## Configuration

`.env.example` documents every variable the stack reads, and
`deploy/.env.prod.example` is the production template. Nothing sensitive has a working
default: the app **refuses to start** outside dev with a weak or default `JWT_SECRET`, and
billing endpoints return `BILLING_NOT_CONFIGURED` rather than failing obscurely when Razorpay
keys are absent.

---

## Status

Working end to end: authentication (password, magic link, OTP, Google SSO), organizations and
RBAC, invitations, the shared inbox pipeline, the transactional mail engine, Razorpay billing
with webhooks and GST invoicing, audit logging, feature flags, the marketing site, and the
console.

Known follow-ups are listed per module in [docs/ROADMAP.md](docs/ROADMAP.md).

---

© Prabhix Technologies. Proprietary.
