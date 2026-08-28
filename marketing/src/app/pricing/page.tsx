import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { pricingFaqItems } from "@/content/pricing-faq";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Prabhix platform pricing — Starter (free), Growth (₹2,499/mo), Business (₹7,999/mo), and Enterprise (custom). Annual billing saves 20%.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={faqJsonLd(
          pricingFaqItems.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )}
      />
      <PricingContent />
    </>
  );
}
