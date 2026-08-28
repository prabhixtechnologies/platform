import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Prabhix Technologies — Progressive Research & Automation Business Hub for Innovation & eXperience. Our story, mission, and values.",
  path: "/about",
});

const values = [
  {
    title: "Correctness over speed",
    description:
      "We ship fast, but never at the cost of data integrity. Tenant isolation, idempotent workers, and webhook-driven billing are non-negotiable.",
  },
  {
    title: "Operator empathy",
    description:
      "Software should match how teams actually work — offline technicians, overloaded inboxes, finance teams reconciling at month-end.",
  },
  {
    title: "Transparent engineering",
    description:
      "We document architecture decisions, publish technical blog posts, and build systems our customers can reason about.",
  },
  {
    title: "India-first, global-ready",
    description:
      "INR billing, GST compliance, and local payment rails — with infrastructure patterns that scale internationally.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "Foundation",
    description:
      "Prabhix incorporated. MobiStack enters production with early repair shop partners in Karnataka.",
  },
  {
    year: "2025",
    title: "Platform extraction",
    description:
      "Shared inbox, billing, and RBAC modules extracted from MobiStack into the Prabhix platform monolith.",
  },
  {
    year: "2025",
    title: "Enterprise readiness",
    description:
      "Multi-tenant isolation hardened to three layers. Razorpay webhook pipeline and audit logging shipped.",
  },
  {
    year: "2026",
    title: "Public launch",
    description:
      "Marketing site and self-serve onboarding. Platform open to new organizations and vertical products.",
  },
];

const leadership = [
  {
    name: "Leadership team",
    role: "Founding team",
    bio: "The founding team brings experience from B2B SaaS, mobile operations software, and enterprise infrastructure. Full bios will be published as we grow the executive team.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About"
        title="Software that respects how business actually works"
        description="Prabhix Technologies builds enterprise platforms and vertical products for teams that can't afford fragile tooling."
        centered
        className="pt-24"
      />

      <Section eyebrow="Story" title="How we started">
        <Reveal>
          <div className="prose prose-lg max-w-3xl text-muted-foreground">
            <p>
              Prabhix began inside the operational complexity of mobile repair
              businesses. Shop owners juggled spreadsheets, paper repair slips,
              and disconnected POS systems. Technicians needed part compatibility
              answers on the shop floor — often without reliable Wi-Fi.
            </p>
            <p className="mt-4">
              MobiStack was our first product: a complete repair shop platform
              with offline-first mobile, inventory intelligence, and integrated
              billing. As MobiStack scaled to multi-location chains, we extracted
              the shared infrastructure — mail, billing, RBAC, multi-tenancy —
              into the Prabhix platform.
            </p>
            <p className="mt-4">
              Today, Prabhix serves two audiences from one codebase: vertical
              products like MobiStack, and the enterprise platform that powers
              them and future products.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              The name itself carries a personal thread: &ldquo;Pra&rdquo; from Priti
              and &ldquo;bhi&rdquo; from Abhishek — a quiet nod to the partnership behind
              the company, woven into an acronym that still describes what we build.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="Mission"
        title="Building software that simplifies business"
        className="bg-surface/30"
      >
        <Reveal>
          <Card className="max-w-3xl">
            <p className="text-lg text-muted-foreground">
              Our mission is to replace fragmented operational tooling with
              unified, multi-tenant platforms — so teams spend less time on
              software and more time serving customers. We measure success by
              reduced reconciliation time, fewer wrong-part orders, and inbox
              response times that meet SLAs.
            </p>
          </Card>
        </Reveal>
      </Section>

      <Section eyebrow="PRABHIX" title="What our name means" centered>
        <Reveal>
          <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
            <strong className="text-foreground">PRABHIX</strong> — Progressive
            Research &amp; Automation Business Hub for Innovation &amp;
            eXperience
          </p>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {[
              ["Progressive", "Continuous improvement in architecture and product"],
              ["Research", "Deep domain understanding before we write code"],
              ["Automation", "Workflow engines that eliminate manual handoffs"],
              ["Business Hub", "One platform for operations, not ten tabs"],
              ["Innovation", "New capabilities grounded in real customer pain"],
              ["eXperience", "Interfaces that field teams actually adopt"],
            ].map(([term, desc]) => (
              <div key={term} className="glass rounded-xl p-4">
                <h3 className="font-semibold text-primary">{term}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Values" title="How we operate">
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <Card>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Leadership" title="Team" className="bg-surface/30">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person) => (
            <Reveal key={person.name}>
              <Card>
                <div className="mb-4 size-16 rounded-full bg-linear-to-br from-primary to-accent opacity-80" />
                <h3 className="font-semibold">{person.name}</h3>
                <Badge className="mt-2">{person.role}</Badge>
                <p className="mt-4 text-sm text-muted-foreground">{person.bio}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Timeline" title="Our journey">
        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute bottom-0 left-[11px] top-0 w-px bg-border lg:left-1/2 lg:-translate-x-px"
            aria-hidden
          />
          <ol className="space-y-10">
            {timeline.map((item, i) => (
              <Reveal key={item.year + item.title} delay={i * 0.1}>
                <li
                  className={`relative pl-10 lg:w-1/2 lg:pl-0 ${
                    i % 2 === 0
                      ? "lg:mr-auto lg:pr-12 lg:text-right"
                      : "lg:ml-auto lg:pl-12"
                  }`}
                >
                  <span
                    className={`absolute top-1.5 size-3 rounded-full bg-primary ${
                      i % 2 === 0
                        ? "left-0 lg:left-auto lg:right-[-6px]"
                        : "left-0 lg:left-[-6px]"
                    }`}
                    aria-hidden
                  />
                  <Badge variant="outline">{item.year}</Badge>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <CTABand
        title="Work with us"
        description="Explore careers, partner on custom development, or book a platform demo."
        secondaryLabel="View careers"
        secondaryHref="/careers"
      />
    </>
  );
}
