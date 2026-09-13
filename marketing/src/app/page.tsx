import type { Metadata } from "next";
import {
  ArrowRight,
  Shield,
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
import { productApps } from "@/content/products";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software that simplifies business",
  description:
    "Prabhix Technologies builds focused SaaS products — OneOps for operations teams, MobiStack for mobile repair shops, and more — with shared identity and enterprise-grade foundations.",
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
      "Tenant isolation, RBAC with fine-grained permissions, and append-only audit logs — baked into every product.",
  },
  {
    icon: Zap,
    title: "Built for scale",
    description:
      "Cursor pagination, Redis caching, and horizontal API scaling — designed for organizations that grow.",
  },
];

const acronymParts = PRABHIX_ACRONYM;

export default function HomePage() {
  return (
    <>
      {/* First viewport: brand, one headline, one sentence, CTAs, atmosphere — nothing else. */}
      <section className="relative flex min-h-[min(100dvh,52rem)] flex-col justify-center overflow-hidden px-0 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <GradientMesh />
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="font-display text-2xl font-semibold tracking-tight break-words text-foreground sm:text-4xl md:text-5xl">
                Prabhix Technologies
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-7 text-[1.7rem] font-bold leading-tight tracking-tight break-words sm:text-5xl lg:text-7xl lg:leading-[1.02]">
                Building software that{" "}
                <span className="text-gradient">simplifies business</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Focused products for real operations — not a single platform pretending to be everything.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/products" size="lg" className="min-w-[11rem] shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">
                  Explore products
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button href="/contact?intent=demo" variant="secondary" size="lg" className="min-w-[11rem] backdrop-blur-sm transition hover:-translate-y-0.5">
                  Book a demo
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Products"
        title="What we ship"
        description="Each product solves a specific job. Shared identity and engineering practices underneath — distinct experiences on top."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {productApps.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.1}>
              <Card hover className="h-full">
                <Badge className="mb-3">
                  {product.status === "live" ? "Live" : "Coming soon"}
                </Badge>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 text-primary">{product.tagline}</p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={`/products/${product.slug}`} size="sm">
                    Learn more
                  </Button>
                  <Button
                    href={appUrls[product.app]}
                    variant="secondary"
                    size="sm"
                    external
                  >
                    Sign in
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/products" variant="secondary">
            Full product catalog
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Section>

      <Section
        eyebrow="Approach"
        title="How we build"
        description="Engineering practices shared across Prabhix products — not a product catalog masquerading as the company."
        className="bg-surface/40"
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
        <div className="mt-10 text-center">
          <Button href="/platform" variant="secondary">
            Engineering deep dive
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Section>

      <Section
        eyebrow="Featured"
        title="MobiStack"
        description="Mobile repair shop management — from intake to invoice, with an offline-first technician app."
      >
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4">Live product</Badge>
              <h3 className="text-2xl font-bold sm:text-3xl">
                Run your repair shop end to end
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
                  Explore MobiStack
                </Button>
                <Button href={appUrls.mobistack} variant="secondary" external>
                  Sign in to MobiStack
                </Button>
              </div>
            </div>
            <div
              className="relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br from-primary/25 via-surface to-accent/20"
              aria-hidden
            >
              <div className="absolute inset-0 mesh-glow opacity-60" />
              <div className="absolute inset-6 flex flex-col justify-end gap-3">
                <div className="h-3 w-1/3 rounded bg-primary/40" />
                <div className="h-2 w-full rounded bg-border/80" />
                <div className="h-2 w-4/5 rounded bg-border/80" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 rounded-lg bg-surface/70" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="The name"
        title="What PRABHIX stands for"
        description="A reminder of the values behind the company — not a product feature list."
        className="bg-surface/40"
      >
        <Reveal>
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
        </Reveal>
      </Section>

      <TestimonialsSection />

      <CTABand
        title="Ready to simplify your operations?"
        description="Talk to our team about OneOps, MobiStack, or custom enterprise development."
      />
    </>
  );
}
