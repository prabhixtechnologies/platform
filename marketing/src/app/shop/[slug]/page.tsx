import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import {
  ProductPurchasePanel,
  ProductTypeSection,
} from "@/components/commerce/product-purchase-panel";
import { ProductTypeBadge } from "@/components/commerce/product-type-badge";
import { getProduct as fetchProduct } from "@/lib/commerce/api";
import { CommerceApiError } from "@/lib/commerce/errors";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProduct(slug);
    return pageMetadata({
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.tagline ?? product.description ?? "",
      path: `/shop/${slug}`,
      ogTitle: product.name,
    });
  } catch {
    return { title: "Product not found" };
  }
}

function shopProductJsonLd(product: Awaited<ReturnType<typeof fetchProduct>>) {
  const variant = product.variants.find((v) => v.active) ?? product.variants[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.tagline,
    sku: variant?.sku,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/shop/${product.slug}`,
    offers: variant
      ? {
          "@type": "Offer",
          priceCurrency: variant.currency,
          price: (variant.pricePaise / 100).toFixed(2),
          availability:
            variant.trackInventory && (variant.stockAvailable ?? 0) <= 0
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          url: `${siteConfig.url}/shop/${product.slug}`,
        }
      : undefined,
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await fetchProduct(slug);
  } catch (err) {
    if (err instanceof CommerceApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/shop/${slug}` },
          ]),
          shopProductJsonLd(product),
        ]}
      />
      <Section className="pt-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div
              className="flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 via-surface to-accent/10"
              aria-hidden
            >
              <span className="text-6xl font-bold text-primary/25">
                {product.name.charAt(0)}
              </span>
            </div>
            {product.galleryFileIds && product.galleryFileIds.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {product.galleryFileIds.length + 1} images — gallery available after media CDN is configured.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.05}>
            <ProductTypeBadge type={product.productType} />
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-3 text-lg text-primary">{product.tagline}</p>
            )}
            {product.description && (
              <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
            <div className="mt-8 lg:sticky lg:top-24">
              <ProductPurchasePanel product={product} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Details" title="What to expect">
        <ProductTypeSection product={product} />
      </Section>
    </>
  );
}
