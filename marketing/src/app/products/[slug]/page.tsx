import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Check,
  CreditCard,
  Lock,
  Mail,
  Server,
  Shield,
  Users,
} from "lucide-react";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getProduct, productAppUrl, products } from "@/content/products";
import { breadcrumbJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return pageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${slug}`,
  });
}

const oneOpsModules = [
  {
    icon: Users,
    title: "Multi-tenant workspaces",
    description:
      "Each customer organization has isolated data boundaries. Members, teams, roles, and invites — scoped by organization_id.",
  },
  {
    icon: Mail,
    title: "Unified email & helpdesk",
    description:
      "Shared inboxes with IMAP ingestion, conversation threading, agent assignment, SLA tracking, and canned replies.",
  },
  {
    icon: CreditCard,
    title: "Razorpay billing",
    description:
      "Plans, subscriptions, seat-based proration, GST invoicing, and webhook-driven entitlements.",
  },
  {
    icon: Lock,
    title: "RBAC",
    description:
      "Fine-grained permissions bundled into system and custom roles with team scoping.",
  },
  {
    icon: Shield,
    title: "Audit logging",
    description:
      "Append-only audit trail for sensitive operations, with archival for long-term retention.",
  },
  {
    icon: Server,
    title: "Built to scale",
    description:
      "Cursor pagination, Redis caches, and outbox workers so a single organization can grow large.",
  },
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // Derived from what the product is, not from its slug. A module has no deployment of its own,
  // so the primary action can only be to talk to us.
  const appUrl = productAppUrl(product);
  const primaryHref = appUrl ?? "/contact?intent=demo";
  const ctaLabel = appUrl ? `Open ${product.name}` : "Request demo";

  return (
    <>
      <ProductViewTracker slug={slug} name={product.name} />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${slug}` },
          ]),
          productJsonLd(product),
        ]}
      />
      <Section className="pt-24">
        <Reveal>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>{product.status === "live" ? "Live product" : "Coming soon"}</Badge>
            {product.kind === "module" && (
              <Badge variant="outline">Part of OneOps</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-primary sm:text-xl">{product.tagline}</p>
          <p className="mt-6 max-w-3xl text-base text-muted-foreground sm:text-lg">
            {product.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={primaryHref} external={Boolean(appUrl)} size="lg">
              {ctaLabel}
            </Button>
            {appUrl && (
              <Button
                href={`/contact?intent=${slug === "mobistack" ? "mobistack" : "demo"}`}
                variant="secondary"
                size="lg"
              >
                Request demo
              </Button>
            )}
            {slug === "oneops" && (
              <Button href="/pricing" variant="ghost" size="lg">
                OneOps pricing
              </Button>
            )}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Features" title="Capabilities" className="bg-surface/40">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.features.map((feature, i) => (
            <Reveal key={feature} delay={i * 0.05}>
              <Card className="flex gap-3">
                <Check className="size-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm text-muted-foreground">{feature}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {slug === "oneops" && (
        <>
          <Section
            eyebrow="Architecture"
            title="What sits inside OneOps"
            description="Module detail for the operator console — not a company-wide platform pitch."
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {oneOpsModules.map((mod, i) => (
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

          <Section
            eyebrow="Isolation"
            title="Tenant boundaries"
            description="Shared-schema multi-tenancy with redundant isolation layers so one organization never sees another’s data."
            className="bg-surface/40"
          >
            <Reveal>
              <Card>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <li>
                    <span className="font-medium text-foreground">JWT claims — </span>
                    organization membership carried in the access token
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Request filters — </span>
                    tenant context applied on every API call
                  </li>
                  <li>
                    <span className="font-medium text-foreground">ORM filters — </span>
                    Hibernate query filters scoped by organization_id
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Postgres RLS — </span>
                    row-level security on high-risk tables
                  </li>
                </ul>
              </Card>
            </Reveal>
          </Section>
        </>
      )}

      {slug === "mobistack" && (
        <Section eyebrow="Offline-first" title="Built for the shop floor">
          <Reveal>
            <Card>
              <p className="text-muted-foreground">
                Technicians create repair tickets, look up part compatibility, and
                update inventory from a mobile app that works without connectivity.
                Changes sync in the background with domain-specific conflict
                resolution — server wins on status, append-only on notes, merge UI
                for inventory counts.
              </p>
            </Card>
          </Reveal>
        </Section>
      )}

      <CTABand
        title={`Try ${product.name}`}
        description={
          appUrl
            ? "Sign in to the live application, or book a guided walkthrough with our team."
            : "Book a walkthrough tailored to your team's workflow."
        }
        primaryLabel={ctaLabel}
        primaryHref={primaryHref}
        secondaryLabel="Book demo"
        secondaryHref="/contact?intent=demo"
      />
    </>
  );
}
