import type { Metadata } from "next";
import {
  Boxes,
  Code2,
  Lock,
  Server,
  Shield,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How we build",
  description:
    "How Prabhix Technologies designs and ships software — shared identity, tenant isolation, modular backends, and product-specific experiences. Engineering practices, not a single product pitch.",
  path: "/platform",
});

const practices = [
  {
    icon: Lock,
    title: "One identity, many products",
    description:
      "Customers sign in once through Prabhix Identity. Each product — OneOps, MobiStack, and what comes next — is a client of that provider, not its own login silo.",
  },
  {
    icon: Shield,
    title: "Tenant isolation by default",
    description:
      "Organization-scoped data at every layer: JWT claims, request filters, ORM filters, and Postgres row-level security on high-risk tables.",
  },
  {
    icon: Workflow,
    title: "Automation over busywork",
    description:
      "Outbox workers, webhook-driven entitlements, and rule-based routing so teams spend time on decisions, not handoffs.",
  },
  {
    icon: Code2,
    title: "Modular monoliths",
    description:
      "Clear module boundaries inside a deployable unit — auth, org, mail, billing, audit — so we move fast without losing operational clarity.",
  },
  {
    icon: Server,
    title: "Designed to scale",
    description:
      "Cursor pagination, Redis caches, SKIP LOCKED workers, and partitioned hot paths when a single organization grows large.",
  },
  {
    icon: Boxes,
    title: "Product-shaped experiences",
    description:
      "Shared foundations do not mean a generic UI. Each product owns its workflows, mobile apps, and domain language.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <Section
        eyebrow="Engineering"
        title="How we build"
        description="Prabhix is a company that ships products. This page is about the engineering practices behind them — not a claim that one console is the whole business."
        centered
        className="pt-24"
      />

      <Section eyebrow="Practices" title="What every Prabhix product inherits">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practices.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <Card hover>
                <item.icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Products"
        title="Architecture lives with the product"
        description="Module maps, inbox pipelines, and repair-shop workflows belong on product pages — not as a company-wide “platform” pitch."
        className="bg-surface/40"
      >
        <Reveal>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href="/products/oneops">OneOps architecture</Button>
            <Button href="/products/mobistack" variant="secondary">
              MobiStack capabilities
            </Button>
            <Button href="/products" variant="ghost">
              All products
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Stack" title="A short technical snapshot">
        <Reveal>
          <Card>
            <ul className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <li>
                <span className="font-medium text-foreground">APIs — </span>
                Spring Boot modular services with clear domain modules
              </li>
              <li>
                <span className="font-medium text-foreground">Data — </span>
                PostgreSQL with tenant scoping; Redis for cache and fan-out
              </li>
              <li>
                <span className="font-medium text-foreground">Web — </span>
                Next.js marketing and product SPAs with shared design tokens
              </li>
              <li>
                <span className="font-medium text-foreground">Mobile — </span>
                Offline-first apps where the field work demands it
              </li>
              <li>
                <span className="font-medium text-foreground">Identity — </span>
                Central OIDC provider for first-party products
              </li>
              <li>
                <span className="font-medium text-foreground">Billing — </span>
                Razorpay subscriptions and GST-aware invoicing where sold
              </li>
            </ul>
          </Card>
        </Reveal>
      </Section>

      <CTABand
        title="Want a walkthrough?"
        description="Book a session focused on the product that fits your team — OneOps, MobiStack, or a custom build."
      />
    </>
  );
}
