"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/commerce/product-card";
import { listProducts } from "@/lib/commerce/api";
import { friendlyCommerceError } from "@/lib/commerce/errors";
import type { ProductSummary, ProductType } from "@/lib/commerce/schemas";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const TYPE_FILTERS: { value: ProductType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All types" },
  { value: "PHYSICAL", label: "Physical" },
  { value: "DIGITAL", label: "Digital" },
  { value: "SERVICE", label: "Services" },
  { value: "SUBSCRIPTION", label: "Subscriptions" },
];

export function ShopCatalog() {
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductType | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("featured");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(async (nextCursor: string | null, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const page = await listProducts({
        cursor: nextCursor ?? undefined,
        limit: 24,
      });
      setItems((prev) => (append ? [...prev, ...page.items] : page.items));
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (err) {
      setError(friendlyCommerceError(err));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadPage(null, false);
  }, [loadPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && cursor) {
          void loadPage(cursor, true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, loadPage]);

  const filtered = useMemo(() => {
    let list = [...items];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tagline?.toLowerCase().includes(q) ?? false),
      );
    }
    if (typeFilter !== "ALL") {
      list = list.filter((p) => p.productType === typeFilter);
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.fromPriceMinor - b.fromPriceMinor);
        break;
      case "price-desc":
        list.sort((a, b) => b.fromPriceMinor - a.fromPriceMinor);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [items, search, typeFilter, sort]);

  if (loading && items.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl bg-surface"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="min-h-11 w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden />
            <span className="sr-only sm:not-sr-only">Type</span>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as ProductType | "ALL")
              }
              aria-label="Filter by product type"
              className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort products"
              className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
        >
          {error}
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => void loadPage(null, false)}
          >
            Retry
          </button>
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <p className="py-12 text-center text-muted-foreground">
          No products match your filters.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8" aria-hidden />
      {loadingMore && (
        <p className="text-center text-sm text-muted-foreground">Loading more…</p>
      )}
    </div>
  );
}
