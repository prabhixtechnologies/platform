import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { CheckoutClient } from "@/components/commerce/checkout-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your purchase securely with Razorpay.",
  path: "/shop/checkout",
});

export default function CheckoutPage() {
  return (
    <Section title="Checkout" description="Secure payment powered by Razorpay" className="pt-24">
      <CheckoutClient />
    </Section>
  );
}
