import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
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
            {/* Only offer a second CTA when it says something different to the first. */}
            {appUrl && (
              <Button
                href={`/contact?intent=${slug === "mobistack" ? "mobistack" : "demo"}`}
                variant="secondary"
                size="lg"
              >
                Request demo
              </Button>
            )}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Features" title="Capabilities" className="bg-surface/30">
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
