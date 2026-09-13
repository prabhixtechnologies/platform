import type { Metadata } from "next";
import { GradientMesh } from "@/components/gradient-mesh";
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
      <section className="relative overflow-hidden">
        <GradientMesh />
        <Section
          eyebrow="Shop"
          title="Products built for real businesses"
          description="Software, services, and tools from Prabhix Technologies — secure checkout, GST-compliant invoicing, and delivery tailored to each product type."
          titleAs="h1"
          centered
          className="relative pt-24"
        />
      </section>
      <Section>
        <ShopCatalog />
      </Section>
    </>
  );
}
