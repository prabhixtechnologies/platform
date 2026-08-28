import type { Metadata } from "next";
import {
  CreditCard,
  Lock,
  Mail,
  Server,
  Shield,
  Users,
} from "lucide-react";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Platform",
  description:
    "The Prabhix enterprise platform — multi-tenant workspaces, unified email/helpdesk, Razorpay billing, RBAC, audit logging, and scale to 100k users.",
  path: "/platform",
});

function ArchitectureMobileFallback() {
  const layers = [
    {
      title: "Client layer",
      items: ["Marketing Site (Next.js SSR)", "Customer App (React SPA)", "Mobile Apps (offline-first)"],
    },
    {
      title: "Prabhix API",
      items: ["Spring Boot modular monolith", "auth · org · mail · billing · notify · audit · files · search"],
    },
    {
      title: "Data layer",
      items: ["PostgreSQL 16 — tenant-scoped · RLS", "Redis 7 — cache · pub/sub · rate limits", "S3-compatible — attachments · exports"],
    },
    {
      title: "Tenant isolation",
      items: ["JWT · Filter · Hibernate + Postgres RLS"],
    },
  ];

  return (
    <div className="space-y-4 md:hidden">
      {layers.map((layer) => (
        <div key={layer.title} className="rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground">{layer.title}</h3>
          <ul className="mt-2 space-y-1">
            {layer.items.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <>
      <ArchitectureMobileFallback />
      <div className="hidden md:block">
      <svg
        viewBox="0 0 800 420"
        className="mx-auto w-full max-w-4xl"
        role="img"
        aria-label="Prabhix platform architecture diagram showing client apps connecting to API layer, which connects to PostgreSQL, Redis, and S3"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        {/* Client layer */}
        <rect x="40" y="30" width="160" height="60" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="120" y="55" textAnchor="middle" className="fill-foreground text-xs font-semibold">Marketing Site</text>
        <text x="120" y="72" textAnchor="middle" className="fill-muted-foreground text-[10px]">Next.js SSR</text>

        <rect x="240" y="30" width="160" height="60" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="320" y="55" textAnchor="middle" className="fill-foreground text-xs font-semibold">Customer App</text>
        <text x="320" y="72" textAnchor="middle" className="fill-muted-foreground text-[10px]">React SPA</text>

        <rect x="440" y="30" width="160" height="60" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="520" y="55" textAnchor="middle" className="fill-foreground text-xs font-semibold">Mobile Apps</text>
        <text x="520" y="72" textAnchor="middle" className="fill-muted-foreground text-[10px]">Offline-first</text>

        {/* API layer */}
        <rect x="120" y="150" width="560" height="80" rx="12" fill="url(#grad1)" fillOpacity="0.15" stroke="#7C3AED" strokeWidth="1.5" />
        <text x="400" y="185" textAnchor="middle" className="fill-foreground text-sm font-bold">Prabhix API — Spring Boot Modular Monolith</text>
        <text x="400" y="205" textAnchor="middle" className="fill-muted-foreground text-[11px]">auth · org · mail · billing · notify · audit · files · search</text>

        {/* Arrows down from clients */}
        <line x1="120" y1="90" x2="280" y2="150" stroke="#7C3AED" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="320" y1="90" x2="400" y2="150" stroke="#7C3AED" strokeWidth="1.5" />
        <line x1="520" y1="90" x2="520" y2="150" stroke="#7C3AED" strokeWidth="1.5" />

        {/* Data layer */}
        <rect x="80" y="300" width="180" height="70" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="170" y="330" textAnchor="middle" className="fill-foreground text-xs font-semibold">PostgreSQL 16</text>
        <text x="170" y="348" textAnchor="middle" className="fill-muted-foreground text-[10px]">Tenant-scoped · RLS</text>

        <rect x="310" y="300" width="180" height="70" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="400" y="330" textAnchor="middle" className="fill-foreground text-xs font-semibold">Redis 7</text>
        <text x="400" y="348" textAnchor="middle" className="fill-muted-foreground text-[10px]">Cache · pub/sub · rate limits</text>

        <rect x="540" y="300" width="180" height="70" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
        <text x="630" y="330" textAnchor="middle" className="fill-foreground text-xs font-semibold">S3-compatible</text>
        <text x="630" y="348" textAnchor="middle" className="fill-muted-foreground text-[10px]">Attachments · exports</text>

        <line x1="280" y1="230" x2="170" y2="300" stroke="#22D3EE" strokeWidth="1.5" />
        <line x1="400" y1="230" x2="400" y2="300" stroke="#22D3EE" strokeWidth="1.5" />
        <line x1="520" y1="230" x2="630" y2="300" stroke="#22D3EE" strokeWidth="1.5" />

        {/* Tenant isolation callout */}
        <rect x="580" y="150" width="180" height="70" rx="8" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4" />
        <text x="670" y="178" textAnchor="middle" className="fill-primary text-[10px] font-semibold">3-layer isolation</text>
        <text x="670" y="193" textAnchor="middle" className="fill-muted-foreground text-[9px]">JWT · Filter · Hibernate</text>
        <text x="670" y="208" textAnchor="middle" className="fill-muted-foreground text-[9px]">+ Postgres RLS</text>
      </svg>
      </div>
    </>
  );
}

function TenantMobileFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:hidden">
      {["Org A", "Org B", "Org C"].map((org) => (
        <div key={org} className="rounded-xl border border-primary/40 p-4">
          <h3 className="font-bold text-foreground">{org}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Teams &amp; RBAC</li>
            <li>Mailboxes</li>
            <li>Billing</li>
            <li>Product data</li>
          </ul>
          <p className="mt-3 text-xs font-semibold text-primary">organization_id scoped</p>
        </div>
      ))}
    </div>
  );
}

function TenantDiagram() {
  return (
    <>
      <TenantMobileFallback />
      <div className="hidden md:block">
      <svg
        viewBox="0 0 600 280"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="Multi-tenant workspace diagram showing three isolated organizations sharing one platform"
      >
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 200}, 0)`}>
            <rect x="20" y="20" width="160" height="240" rx="12" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.4" />
            <text x="100" y="50" textAnchor="middle" className="fill-foreground text-xs font-bold">Org {String.fromCharCode(65 + i)}</text>
            <rect x="40" y="70" width="120" height="30" rx="4" fill="#7C3AED" fillOpacity="0.15" />
            <text x="100" y="90" textAnchor="middle" className="fill-muted-foreground text-[10px]">Teams &amp; RBAC</text>
            <rect x="40" y="110" width="120" height="30" rx="4" fill="#7C3AED" fillOpacity="0.15" />
            <text x="100" y="130" textAnchor="middle" className="fill-muted-foreground text-[10px]">Mailboxes</text>
            <rect x="40" y="150" width="120" height="30" rx="4" fill="#7C3AED" fillOpacity="0.15" />
            <text x="100" y="170" textAnchor="middle" className="fill-muted-foreground text-[10px]">Billing</text>
            <rect x="40" y="190" width="120" height="30" rx="4" fill="#22D3EE" fillOpacity="0.15" />
            <text x="100" y="210" textAnchor="middle" className="fill-muted-foreground text-[10px]">Product data</text>
            <text x="100" y="245" textAnchor="middle" className="fill-primary text-[9px] font-semibold">organization_id scoped</text>
          </g>
        ))}
      </svg>
      </div>
    </>
  );
}

const modules = [
  {
    icon: Users,
    title: "Multi-tenant workspaces",
    description:
      "Each customer is an organization with isolated data boundaries. Members, teams, roles, and invites — scoped by organization_id at every layer.",
  },
  {
    icon: Mail,
    title: "Unified email & helpdesk",
    description:
      "Shared inboxes with IMAP ingestion, MIME parsing, conversation threading, agent assignment, SLA tracking, and canned replies.",
  },
  {
    icon: CreditCard,
    title: "Razorpay billing",
    description:
      "Plans, subscriptions, seat-based proration, GST invoicing, and webhook-driven entitlements. Browser callbacks never mutate state alone.",
  },
  {
    icon: Lock,
    title: "RBAC",
    description:
      "Fine-grained permissions (MAIL_READ, BILLING_MANAGE, ORG_MEMBER_INVITE) bundled into system and custom roles with team scoping.",
  },
  {
    icon: Shield,
    title: "Audit logging",
    description:
      "Append-only audit trail for sensitive operations. Partitioned storage with S3 archival after 90 days.",
  },
  {
    icon: Server,
    title: "Scale to 100k users",
    description:
      "Cursor pagination, Redis read-through caches, outbox workers with SKIP LOCKED, and monthly table partitioning on hot paths.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <Section
        eyebrow="Platform"
        title="One codebase, enterprise-grade isolation"
        description="The Prabhix platform is a modular monolith — shared infrastructure for every product and customer organization, designed to scale a single org to 100,000 users."
        centered
        className="pt-24"
      />

      <Section eyebrow="Architecture" title="System overview">
        <Reveal>
          <Card>
            <ArchitectureDiagram />
          </Card>
        </Reveal>
      </Section>

      <Section eyebrow="Multi-tenancy" title="Isolated workspaces, shared infrastructure" className="bg-surface/30">
        <Reveal>
          <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
            Shared-schema multi-tenancy with three redundant isolation layers — JWT
            claims, request-scoped tenant filters, and Hibernate query filters —
            plus Postgres row-level security on high-risk tables.
          </p>
          <TenantDiagram />
        </Reveal>
      </Section>

      <Section eyebrow="Modules" title="Platform capabilities">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <Reveal key={mod.title} delay={i * 0.05}>
              <Card hover>
                <mod.icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{mod.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mod.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Scale" title="Designed for 100,000 users in one organization">
        <Reveal>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 font-semibold">Pressure point</th>
                    <th className="pb-3 font-semibold">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Connection pool exhaustion", "HikariCP per instance + PgBouncer in transaction mode"],
                    ["Hot mail tables", "Monthly range partitioning + covering indexes"],
                    ["Deep pagination", "Cursor (keyset) pagination — OFFSET banned on hot paths"],
                    ["Permission checks", "Precomputed into JWT; Redis deny-list for revocation"],
                    ["Background work", "Outbox + SELECT FOR UPDATE SKIP LOCKED workers"],
                    ["Real-time updates", "SSE per org channel, fanned out via Redis pub/sub"],
                  ].map(([pressure, mitigation]) => (
                    <tr key={pressure} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">{pressure}</td>
                      <td className="py-3">{mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>
      </Section>

      <CTABand
        title="See the platform in action"
        description="Book a walkthrough of multi-tenant workspaces, shared inbox, and billing — tailored to your use case."
      />
    </>
  );
}
