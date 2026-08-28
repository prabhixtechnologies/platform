import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { CartPageClient } from "@/components/commerce/cart-page-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cart",
  description: "Review items in your cart before checkout.",
  path: "/shop/cart",
  ogTitle: "Your cart",
});

export default function CartPage() {
  return (
    <Section title="Your cart" className="pt-24">
      <CartPageClient />
    </Section>
  );
}
