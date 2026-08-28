import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { integrations, partners } from "@/content/integrations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Integrations & Partners",
  description:
    "Connect Prabhix with Razorpay, AWS, email, webhooks, and partner ecosystems.",
  path: "/integrations",
});

export default function IntegrationsPage() {
  return (
    <>
      <Section
        eyebrow="Integrations"
        title="Connect your stack"
        description="Prabhix integrates with the payment, infrastructure, and communication tools Indian enterprises already use."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <Badge variant={item.status === "available" ? "accent" : "outline"}>
                    {item.status === "available" ? "Available" : "Planned"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Partners" title="Partner with Prabhix" className="bg-surface/30">
        <div className="grid gap-6 md:grid-cols-3">
          {partners.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 0.08}>
              <Card>
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {partner.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/contact?intent=enterprise" size="lg">
            Become a partner
          </Button>
        </div>
      </Section>

      <CTABand
        title="Building a custom integration?"
        description="We document every public endpoint and help partners through security review."
        primaryLabel="Talk to engineering"
        primaryHref="/contact?intent=enterprise"
        secondaryLabel="View docs"
        secondaryHref="/docs"
      />
    </>
  );
}
