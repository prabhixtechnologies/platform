import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { caseStudies } from "@/content/case-studies";
import { products } from "@/content/products";
import { listProducts } from "@/lib/commerce/api";
import { getCareerSlugs } from "@/lib/careers-api";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/about",
    "/platform",
    "/products",
    "/shop",
    "/services",
    "/pricing",
    "/case-studies",
    "/blog",
    "/careers",
    "/contact",
    "/docs",
    "/integrations",
    "/changelog",
    "/status",
    "/legal/privacy",
    "/legal/terms",
    "/legal/security",
    "/legal/dpa",
  ];

  const careerSlugs = await getCareerSlugs();

  let shopProducts: { slug: string }[] = [];
  try {
    let cursor: string | null = null;
    let hasMore = true;
    while (hasMore && shopProducts.length < 500) {
      const page = await listProducts({ cursor: cursor ?? undefined, limit: 100 });
      shopProducts = [...shopProducts, ...page.items];
      cursor = page.nextCursor;
      hasMore = page.hasMore;
    }
  } catch {
    /* shop may be unavailable at build time */
  }

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...shopProducts.map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseStudies.map((c) => ({
      url: `${base}/case-studies/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...careerSlugs.map((slug) => ({
      url: `${base}/careers/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
