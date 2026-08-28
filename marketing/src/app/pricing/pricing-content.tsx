"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Accordion } from "@/components/Accordion";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { trackEvent } from "@/lib/visitor/tracker";
import { cn, formatCurrency } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    description: "For small teams evaluating the platform.",
    cta: "Get started",
    href: "/contact?intent=starter",
    highlighted: false,
    features: [
      "Up to 5 users",
      "1 workspace",
      "Basic shared inbox (1 mailbox)",
      "Community support",
      "MobiStack trial access",
    ],
  },
  {
    name: "Growth",
    monthly: 2499,
    description: "For growing teams that need full platform access.",
    cta: "Start Growth",
    href: "/contact?intent=growth",
    highlighted: true,
    features: [
      "Up to 25 users",
      "3 workspaces",
      "Shared inbox with SLA tracking",
      "Razorpay billing integration",
      "RBAC with custom roles",
      "Email support (24h SLA)",
    ],
  },
  {
    name: "Business",
    monthly: 7999,
    description: "For organizations with advanced compliance needs.",
    cta: "Start Business",
    href: "/contact?intent=business",
    highlighted: false,
    features: [
      "Up to 100 users",
      "Unlimited workspaces",
      "Advanced helpdesk + automation rules",
      "Audit log export",
      "Priority support (4h SLA)",
      "Custom domain mail",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "For large orgs — up to 100k users, custom SLAs.",
    cta: "Contact sales",
    href: "/contact?intent=enterprise",
    highlighted: false,
    features: [
      "Unlimited users",
      "Dedicated infrastructure options",
      "SSO / SAML integration",
      "Custom DPA and security review",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
  },
];

const comparisonFeatures = [
  { name: "Users", starter: "5", growth: "25", business: "100", enterprise: "Custom" },
  { name: "Workspaces", starter: "1", growth: "3", business: "Unlimited", enterprise: "Unlimited" },
  { name: "Shared inbox", starter: true, growth: true, business: true, enterprise: true },
  { name: "SLA tracking", starter: false, growth: true, business: true, enterprise: true },
  { name: "Razorpay billing", starter: false, growth: true, business: true, enterprise: true },
  { name: "Custom RBAC roles", starter: false, growth: true, business: true, enterprise: true },
  { name: "Audit log export", starter: false, growth: false, business: true, enterprise: true },
  { name: "SSO / SAML", starter: false, growth: false, business: false, enterprise: true },
  { name: "Dedicated support", starter: false, growth: false, business: true, enterprise: true },
];

import { pricingFaqItems } from "@/content/pricing-faq";

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-5 text-primary" aria-label="Included" />
  ) : (
    <X className="mx-auto size-5 text-muted" aria-label="Not included" />
  );
}

export function PricingContent() {
  const [annual, setAnnual] = useState(false);

  function displayPrice(monthly: number | null): string {
    if (monthly === null) return "Custom";
    if (monthly === 0) return formatCurrency(0);
    const price = annual ? Math.round(monthly * 12 * 0.8) : monthly;
    return formatCurrency(price);
  }

  function priceSuffix(monthly: number | null): string {
    if (monthly === null || monthly === 0) return monthly === 0 ? "forever" : "pricing";
    return annual ? "/year" : "/month";
  }

  return (
    <>
      <Section
        eyebrow="Pricing"
        title="Plans that scale with your organization"
        description="Start free, upgrade as you grow. All plans include core platform security and tenant isolation."
        centered
        className="pt-24"
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span className={cn("text-sm font-medium", !annual && "text-foreground")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              annual ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-6 rounded-full bg-white transition-transform",
                annual ? "left-5" : "left-0.5",
              )}
            />
          </button>
          <span className={cn("text-sm font-medium", annual && "text-foreground")}>
            Annual
          </span>
          {annual && <Badge variant="accent">Save 20%</Badge>}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <Card
                className={cn(
                  "flex h-full flex-col",
                  tier.highlighted && "border-primary/40 ring-1 ring-primary/20",
                )}
              >
                {tier.highlighted && (
                  <Badge className="mb-4 w-fit">Most popular</Badge>
                )}
                <h2 className="text-xl font-bold">{tier.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-bold">{displayPrice(tier.monthly)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {priceSuffix(tier.monthly)}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 shrink-0 text-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  onClick={() =>
                    trackEvent("pricing_plan_clicked", {
                      plan: tier.name.toLowerCase(),
                    })
                  }
                >
                  {tier.cta}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Compare" title="Feature comparison" className="bg-surface/30">
        <Reveal>
          <div className="space-y-6 md:hidden">
            {(["Starter", "Growth", "Business", "Enterprise"] as const).map((tier) => (
              <Card key={tier}>
                <h3 className="text-lg font-bold">{tier}</h3>
                <ul className="mt-4 space-y-3">
                  {comparisonFeatures.map((row) => {
                    const key = tier.toLowerCase() as
                      | "starter"
                      | "growth"
                      | "business"
                      | "enterprise";
                    return (
                      <li
                        key={row.name}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="font-medium text-foreground">{row.name}</span>
                        <CellValue value={row[key]} />
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </div>
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 pr-4 font-semibold">Feature</th>
                  <th className="pb-4 px-4 text-center font-semibold">Starter</th>
                  <th className="pb-4 px-4 text-center font-semibold">Growth</th>
                  <th className="pb-4 px-4 text-center font-semibold">Business</th>
                  <th className="pb-4 pl-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row) => (
                  <tr key={row.name} className="border-b border-border/50">
                    <td className="py-4 pr-4 font-medium">{row.name}</td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.starter} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.growth} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.business} />
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <CellValue value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="FAQ" title="Common questions">
        <Reveal>
          <Accordion items={[...pricingFaqItems]} />
        </Reveal>
      </Section>

      <CTABand
        title="Not sure which plan fits?"
        description="Our team will help you choose based on team size, modules, and compliance requirements."
        primaryLabel="Talk to sales"
        primaryHref="/contact?intent=enterprise"
      />
    </>
  );
}
