import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getCaseStudy } from "@/content/case-studies";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <Section className="pt-24">
        <Reveal>
          <Badge variant="outline" className="mb-4">
            {study.industry}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{study.client}</p>
        </Reveal>
      </Section>

      <Section className="bg-surface/30 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <Card className="text-center">
                <p className="text-3xl font-bold text-primary">{m.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Challenge" title="The problem">
        <Reveal>
          <p className="max-w-3xl text-lg text-muted-foreground">
            {study.challenge}
          </p>
        </Reveal>
      </Section>

      <Section eyebrow="Solution" title="What we deployed" className="bg-surface/30">
        <Reveal>
          <p className="max-w-3xl text-lg text-muted-foreground">
            {study.solution}
          </p>
        </Reveal>
      </Section>

      <Section eyebrow="Results" title="Measured outcomes">
        <Reveal>
          <ul className="max-w-3xl space-y-4">
            {study.results.map((result) => (
              <li
                key={result}
                className="flex gap-3 text-muted-foreground"
              >
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {result}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <CTABand
        title="Similar challenges?"
        description="See how MobiStack or the Prabhix platform can streamline your operations."
        primaryLabel="Book a demo"
        primaryHref="/contact?intent=demo"
        secondaryLabel="View MobiStack"
        secondaryHref="/products/mobistack"
      />
    </>
  );
}
