import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/shop/cart",
        "/shop/checkout",
        "/shop/order",
        "/shop/order/",
        "/download",
        "/download/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}