import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import {
  MailroomPreview,
  MobiStackPreview,
  OneOpsPreview,
} from "@/components/product-preview";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { productAppUrl, products } from "@/content/products";

/**
 * The preview for a product, keyed by slug.
 *
 * Each one renders in its own product's accent pair, which is the whole argument the page
 * is making: these are separate products, not one product with three names. A page that
 * described three distinct experiences entirely in prose was asking to be taken on faith.
 * Modules have no preview because they have no interface of their own.
 */
const PREVIEWS: Record<string, ComponentType<{ className?: string }>> = {
  oneops: OneOpsPreview,
  mobistack: MobiStackPreview,
  mailroom: MailroomPreview,
};

export const metadata: Metadata = {
  title: "Products",
  description:
    "Prabhix Technologies products — OneOps for operations teams, MobiStack for mobile repair shops, and modules like Helpdesk.",
};

export default function ProductsPage() {
  return (
    <>
      <Section titleAs="h1"
        eyebrow="Products"
        title="Products from Prabhix Technologies"
        description="Each product solves a specific job. Shared identity and engineering practices underneath — distinct experiences on top."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-8">
          {products.map((product, i) => {
            const appUrl = productAppUrl(product);
            const Preview = PREVIEWS[product.slug];
            return (
            <Reveal key={product.slug} delay={i * 0.1}>
              <Card hover className="group">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                      <Badge variant={product.status === "live" ? "default" : "outline"}>
                        {product.status === "live" ? "Live" : "Coming soon"}
                      </Badge>
                      {product.kind === "module" && (
                        <Badge variant="outline">Part of OneOps</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-lg text-accent-text">{product.tagline}</p>
                    <p className="mt-4 text-muted-foreground">{product.description}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {product.features.slice(0, 4).map((f) => (
                        <li key={f} className="text-sm text-muted-foreground">
                          • {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent-text hover:underline"
                    >
                      View details
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    {/*
                      Only something with its own deployment gets "Open app". A module lives inside
                      OneOps, so the honest action is to open OneOps or ask for a demo.
                    */}
                    {product.status === "live" && appUrl ? (
                      <a
                        href={appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Open {product.name}
                        <ExternalLink className="size-4" aria-hidden />
                      </a>
                    ) : (
                      <Link
                        href="/contact?intent=demo"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Request a demo
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>

                {Preview ? (
                  <div className="mt-8 border-t border-border/60 pt-8">
                    <Preview />
                  </div>
                ) : null}
              </Card>
            </Reveal>
            );
          })}
        </div>
      </Section>

      <CTABand
        title="Need something custom?"
        description="We build vertical products and custom enterprise software for teams that need more than an off-the-shelf fit."
        primaryLabel="Talk to sales"
        primaryHref="/contact"
        secondaryLabel="View services"
        secondaryHref="/services"
      />
    </>
  );
}
