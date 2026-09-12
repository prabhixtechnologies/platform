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
import { pricingFaqItems } from "@/content/pricing-faq";

type ProductTab = "oneops" | "mobistack";

type Tier = {
  name: string;
  monthly: number | null;
  description: string;
  cta: string;
  href: string;
  highlighted: boolean;
  features: string[];
};

const productTabs: { id: ProductTab; label: string; blurb: string }[] = [
  {
    id: "oneops",
    label: "OneOps",
    blurb: "Operator console — inbox, chat, storefront, and staff.",
  },
  {
    id: "mobistack",
    label: "MobiStack",
    blurb: "Mobile repair shop management from intake to invoice.",
  },
];

const oneOpsTiers: Tier[] = [
  {
    name: "Starter",
    monthly: 0,
    description: "For small teams evaluating OneOps.",
    cta: "Get started",
    href: "/contact?intent=starter&product=oneops",
    highlighted: false,
    features: [
      "Up to 5 users",
      "1 workspace",
      "Basic shared inbox (1 mailbox)",
      "Community support",
    ],
  },
  {
    name: "Growth",
    monthly: 2499,
    description: "Full OneOps access for growing operations teams.",
    cta: "Start Growth",
    href: "/contact?intent=growth&product=oneops",
    highlighted: true,
    features: [
      "Up to 25 users",
      "3 workspaces",
      "Shared inbox with SLA tracking",
      "Live chat and visitor presence",
      "Razorpay billing integration",
      "RBAC with custom roles",
      "Email support (24h SLA)",
    ],
  },
  {
    name: "Business",
    monthly: 7999,
    description: "Advanced helpdesk, audit export, and priority support.",
    cta: "Start Business",
    href: "/contact?intent=business&product=oneops",
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
    description: "Large orgs — custom SLAs, SSO, and dedicated options.",
    cta: "Contact sales",
    href: "/contact?intent=enterprise&product=oneops",
    highlighted: false,
    features: [
      "Custom user limits",
      "Dedicated infrastructure options",
      "SSO / SAML integration",
      "Custom DPA and security review",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
  },
];

const mobiStackTiers: Tier[] = [
  {
    name: "Shop",
    monthly: 1999,
    description: "Single-location repair shops getting started.",
    cta: "Start Shop",
    href: "/contact?intent=mobistack&plan=shop",
    highlighted: false,
    features: [
      "1 location",
      "Up to 5 staff seats",
      "Repair tickets and inventory",
      "GST invoicing",
      "Technician mobile app",
    ],
  },
  {
    name: "Multi-shop",
    monthly: 4999,
    description: "Growing chains that need multi-location control.",
    cta: "Start Multi-shop",
    href: "/contact?intent=mobistack&plan=multi",
    highlighted: true,
    features: [
      "Up to 5 locations",
      "Up to 25 staff seats",
      "Part compatibility engine",
      "Razorpay payments",
      "Role-based access per location",
      "Email support (24h SLA)",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "Large networks — custom SLAs and integrations.",
    cta: "Contact sales",
    href: "/contact?intent=enterprise&product=mobistack",
    highlighted: false,
    features: [
      "Unlimited locations",
      "Custom integrations",
      "SSO options",
      "Dedicated onboarding",
      "Priority support",
      "Custom DPA",
    ],
  },
];

const oneOpsComparison = [
  { name: "Users", starter: "5", growth: "25", business: "100", enterprise: "Custom" },
  { name: "Workspaces", starter: "1", growth: "3", business: "Unlimited", enterprise: "Unlimited" },
  { name: "Shared inbox", starter: true, growth: true, business: true, enterprise: true },
  { name: "SLA tracking", starter: false, growth: true, business: true, enterprise: true },
  { name: "Live chat", starter: false, growth: true, business: true, enterprise: true },
  { name: "Razorpay billing", starter: false, growth: true, business: true, enterprise: true },
  { name: "Custom RBAC roles", starter: false, growth: true, business: true, enterprise: true },
  { name: "Audit log export", starter: false, growth: false, business: true, enterprise: true },
  { name: "SSO / SAML", starter: false, growth: false, business: false, enterprise: true },
];

const mobiStackComparison = [
  { name: "Locations", shop: "1", multi: "5", enterprise: "Unlimited" },
  { name: "Staff seats", shop: "5", multi: "25", enterprise: "Custom" },
  { name: "Repair tickets", shop: true, multi: true, enterprise: true },
  { name: "Technician app", shop: true, multi: true, enterprise: true },
  { name: "Part compatibility", shop: false, multi: true, enterprise: true },
  { name: "Razorpay payments", shop: false, multi: true, enterprise: true },
  { name: "SSO options", shop: false, multi: false, enterprise: true },
];

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

function TierGrid({
  tiers,
  annual,
  displayPrice,
  priceSuffix,
  product,
}: {
  tiers: Tier[];
  annual: boolean;
  displayPrice: (monthly: number | null) => string;
  priceSuffix: (monthly: number | null) => string;
  product: ProductTab;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        tiers.length === 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4",
      )}
    >
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
                  product,
                  billing: annual ? "annual" : "monthly",
                })
              }
            >
              {tier.cta}
            </Button>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function PricingContent() {
  const [product, setProduct] = useState<ProductTab>("oneops");
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

  const tiers = product === "oneops" ? oneOpsTiers : mobiStackTiers;
  const activeTab = productTabs.find((t) => t.id === product)!;

  return (
    <>
      <Section
        eyebrow="Pricing"
        title="Plans by product"
        description="OneOps and MobiStack are priced separately. Pick the product you need — there is no single “platform” fee that covers everything."
        centered
        className="pt-24"
      >
        <div
          role="tablist"
          aria-label="Product pricing"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {productTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={product === tab.id}
              id={`pricing-tab-${tab.id}`}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                product === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-foreground border border-border",
              )}
              onClick={() => setProduct(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {activeTab.blurb}
        </p>

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
        <TierGrid
          tiers={tiers}
          annual={annual}
          displayPrice={displayPrice}
          priceSuffix={priceSuffix}
          product={product}
        />
      </Section>

      <Section
        eyebrow="Compare"
        title={`${activeTab.label} feature comparison`}
        className="bg-surface/40"
      >
        <Reveal>
          {product === "oneops" ? (
            <>
              <div className="space-y-6 md:hidden">
                {(["Starter", "Growth", "Business", "Enterprise"] as const).map((tier) => (
                  <Card key={tier}>
                    <h3 className="text-lg font-bold">{tier}</h3>
                    <ul className="mt-4 space-y-3">
                      {oneOpsComparison.map((row) => {
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
                    {oneOpsComparison.map((row) => (
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
            </>
          ) : (
            <>
              <div className="space-y-6 md:hidden">
                {(["Shop", "Multi-shop", "Enterprise"] as const).map((tier) => {
                  const key =
                    tier === "Shop"
                      ? "shop"
                      : tier === "Multi-shop"
                        ? "multi"
                        : "enterprise";
                  return (
                    <Card key={tier}>
                      <h3 className="text-lg font-bold">{tier}</h3>
                      <ul className="mt-4 space-y-3">
                        {mobiStackComparison.map((row) => (
                          <li
                            key={row.name}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <span className="font-medium text-foreground">{row.name}</span>
                            <CellValue value={row[key]} />
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </div>
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-4 pr-4 font-semibold">Feature</th>
                      <th className="pb-4 px-4 text-center font-semibold">Shop</th>
                      <th className="pb-4 px-4 text-center font-semibold">Multi-shop</th>
                      <th className="pb-4 pl-4 text-center font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mobiStackComparison.map((row) => (
                      <tr key={row.name} className="border-b border-border/50">
                        <td className="py-4 pr-4 font-medium">{row.name}</td>
                        <td className="py-4 px-4 text-center">
                          <CellValue value={row.shop} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <CellValue value={row.multi} />
                        </td>
                        <td className="py-4 pl-4 text-center">
                          <CellValue value={row.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Reveal>
      </Section>

      <Section eyebrow="FAQ" title="Common questions">
        <Reveal>
          <Accordion items={[...pricingFaqItems]} />
        </Reveal>
      </Section>

      <CTABand
        title="Not sure which product or plan fits?"
        description="Our team will help you choose based on product fit, team size, and compliance requirements."
        primaryLabel="Talk to sales"
        primaryHref="/contact?intent=enterprise"
      />
    </>
  );
}
