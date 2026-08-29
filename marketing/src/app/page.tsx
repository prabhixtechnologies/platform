import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  CreditCard,
  Mail,
  Shield,
  Smartphone,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { CTABand } from "@/components/cta-band";
import { GradientMesh } from "@/components/gradient-mesh";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { PRABHIX_ACRONYM } from "@/lib/constants";
import { appUrls } from "@/lib/site-config";
import { TestimonialsSection } from "@/components/testimonials-section";
import { StatBand } from "@/components/stat-band";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Enterprise software that simplifies business",
  description:
    "Prabhix Technologies builds multi-tenant SaaS platforms — shared inbox, billing, RBAC, and products like MobiStack for mobile repair businesses.",
  path: "/",
  ogTitle: "Prabhix Technologies — Building software that simplifies business",
});

const pillars = [
  {
    icon: Workflow,
    title: "Automation-first",
    description:
      "Workflow engines, outbox workers, and rule-based routing that eliminate manual handoffs across teams.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "Three-layer tenant isolation, RBAC with fine-grained permissions, and append-only audit logs.",
  },
  {
    icon: Zap,
    title: "Built for scale",
    description:
      "Designed for organizations up to 100,000 users — cursor pagination, Redis caching, and horizontal API scaling.",
  },
];

const platformCapabilities = [
  {
    icon: Mail,
    title: "Shared team inbox",
    description: "Unified email and helpdesk with assignment, SLA tracking, and threaded conversations.",
  },
  {
    icon: CreditCard,
    title: "Razorpay billing",
    description: "Subscriptions, seat-based proration, GST invoicing, and webhook-driven entitlements.",
  },
  {
    icon: Users,
    title: "RBAC & teams",
    description: "System and custom roles, team scoping, and permission checks embedded in JWT claims.",
  },
  {
    icon: Boxes,
    title: "Multi-tenancy",
    description: "Shared-schema isolation with Hibernate filters and Postgres row-level security.",
  },
  {
    icon: Shield,
    title: "Audit & compliance",
    description: "Append-only audit trail, DPA-ready data handling, and security documentation.",
  },
  {
    icon: Smartphone,
    title: "Offline-first mobile",
    description: "Field-ready apps with local-first sync — proven in MobiStack's technician experience.",
  },
];

const acronymParts = PRABHIX_ACRONYM;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
        <GradientMesh />
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Badge variant="accent" className="mb-6">
                Enterprise SaaS · India-built
              </Badge>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Building software that{" "}
                <span className="text-gradient">simplifies business</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Prabhix Technologies delivers multi-tenant platforms with shared
                inbox, billing, and RBAC — plus vertical products like MobiStack
                for mobile repair operations.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/contact?intent=demo" size="lg">
                  Book a demo
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button href="/platform" variant="secondary" size="lg">
                  Explore platform
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="mx-auto mt-20 max-w-3xl">
              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                PRABHIX stands for
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {acronymParts.map((part, i) => (
                  <div key={part.letter} className="flex items-center gap-3">
                    <span className="glass inline-flex size-10 items-center justify-center rounded-xl text-sm font-bold text-primary">
                      {part.letter}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {part.word}
                    </span>
                    {i < acronymParts.length - 1 && (
                      <span className="hidden text-muted-foreground sm:inline" aria-hidden>
                        &
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <StatBand
        stats={[
          { value: "100k+", label: "Users per organization" },
          { value: "3-layer", label: "Tenant isolation" },
          { value: "99.9%", label: "Platform SLA target" },
          { value: "INR-first", label: "Razorpay billing" },
        ]}
      />

      <Section
        eyebrow="Capabilities"
        title="What we build"
        description="A unified platform foundation and vertical products that solve real operational problems."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.1}>
              <Card hover>
                <pillar.icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-muted-foreground">{pillar.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured product"
        title="MobiStack"
        description="Mobile repair shop management — from intake to invoice, with an offline-first technician app."
        className="bg-surface/30"
      >
        <Reveal>
          <Card className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="mb-4">Live product</Badge>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Run your repair business from one platform
                </h3>
                <p className="mt-4 text-muted-foreground">
                  Inventory, repair workflows, point-of-sale, GST billing, and
                  part-compatibility intelligence — built for shops that can&apos;t
                  afford downtime or wrong parts.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li>• Offline-first mobile app for technicians</li>
                  <li>• Serial-tracked inventory with low-stock alerts</li>
                  <li>• Integrated Razorpay payments and invoicing</li>
                  <li>• Multi-location with role-based access</li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/products/mobistack">
                    Explore MobiStack features
                  </Button>
                  <Button href={appUrls.mobistack} variant="secondary" external>
                    Sign in to MobiStack
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl bg-linear-to-br from-primary/20 via-transparent to-accent/20 p-8">
                <div className="glass absolute inset-4 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="h-3 w-1/3 rounded bg-primary/30" />
                    <div className="h-2 w-full rounded bg-border" />
                    <div className="h-2 w-4/5 rounded bg-border" />
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-16 rounded-lg bg-surface" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section
        eyebrow="Platform"
        title="One foundation, many products"
        description="Shared infrastructure that every Prabhix product and customer organization runs on."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platformCapabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 0.05}>
              <Card hover>
                <cap.icon className="size-6 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold">{cap.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cap.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/platform" variant="secondary">
            Platform architecture
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Section>

      <TestimonialsSection />

      <CTABand
        title="Ready to simplify your operations?"
        description="Talk to our team about the Prabhix platform, MobiStack, or custom enterprise development."
      />
    </>
  );
}
