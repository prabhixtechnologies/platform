import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { OrderConfirmationClient } from "@/components/commerce/order-confirmation-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order confirmation",
  description: "Your order confirmation and receipt details.",
  path: "/shop/order",
  ogTitle: "Order confirmation",
});

export default function OrderPage() {
  return (
    <Section className="pt-24">
      <OrderConfirmationClient />
    </Section>
  );
}
