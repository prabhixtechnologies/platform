import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { pricingFaqItems } from "@/content/pricing-faq";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Prabhix product pricing — OneOps plans from free Starter through Enterprise, plus MobiStack shop and multi-shop plans. Annual billing saves 20%.",
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
