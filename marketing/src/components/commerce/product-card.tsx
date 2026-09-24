"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import { Money } from "@/components/commerce/money";
import { ProductTypeBadge } from "@/components/commerce/product-type-badge";
import type { ProductSummary } from "@/lib/commerce/schemas";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = `/shop/${product.slug}`;

  return (
    <Card hover className="flex h-full flex-col">
      <Link href={href} className="group flex flex-1 flex-col focus-visible:outline-none" data-testid="shop-product">
        <div
          className="mb-4 flex aspect-[4/3] items-center justify-center rounded-xl bg-linear-to-br from-primary/10 via-surface to-accent/10"
          aria-hidden
        >
          <span className="text-4xl font-bold text-primary/30">
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProductTypeBadge type={product.productType} />
          {product.featured && (
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Featured
            </span>
          )}
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold tracking-tight group-hover:text-primary">
          {product.name}
        </h2>
        {product.tagline && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.tagline}
          </p>
        )}
        <p className="mt-auto pt-4 text-sm font-medium">
          From{" "}
          <Money amountPaise={product.fromPricePaise} currency={product.currency} />
        </p>
      </Link>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        View product
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Card>
  );
}
