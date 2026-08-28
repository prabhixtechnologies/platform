import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { caseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "How organizations use Prabhix products and platform to simplify operations — repair chains, shared inbox deployments, and more.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Section
        eyebrow="Case Studies"
        title="Results from the field"
        description="Real outcomes from organizations using Prabhix products. Metrics reflect measured improvements during deployment — not projections."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-8">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.1}>
              <Card hover>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <Badge variant="outline" className="mb-3">
                      {study.industry}
                    </Badge>
                    <h2 className="text-2xl font-bold">{study.title}</h2>
                    <p className="mt-3 text-muted-foreground">{study.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {study.metrics.slice(0, 3).map((m) => (
                        <div key={m.label}>
                          <span className="text-lg font-bold text-primary">
                            {m.value}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Read case study
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Share your success story"
        description="Using Prabhix or MobiStack? We'd love to document your results."
        primaryLabel="Contact us"
        primaryHref="/contact"
      />
    </>
  );
}
