import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ShopCatalog } from "@/components/commerce/shop-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop",
  description:
    "Browse and buy Prabhix products — subscriptions, digital downloads, services, and physical goods.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <Section
        eyebrow="Shop"
        title="Products built for real businesses"
        description="Software, services, and tools from Prabhix Technologies — secure checkout, GST-compliant invoicing, and delivery tailored to each product type."
        centered
        className="pt-24"
      />
      <Section>
        <ShopCatalog />
      </Section>
    </>
  );
}
