"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/visitor/tracker";

type ProductViewTrackerProps = {
  slug: string;
  name: string;
};

export function ProductViewTracker({ slug, name }: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent("product_page_viewed", { slug, name });
  }, [slug, name]);

  return null;
}
