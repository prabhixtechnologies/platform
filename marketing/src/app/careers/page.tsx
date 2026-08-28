import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getCareers } from "@/lib/careers-api";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join Prabhix Technologies — backend, frontend, and DevOps roles building enterprise SaaS in India.",
  path: "/careers",
});

export default async function CareersPage() {
  const { roles, source } = await getCareers();

  return (
    <>
      <Section
        eyebrow="Careers"
        title="Build software that simplifies business"
        description="We're a small, focused team building multi-tenant platforms and vertical products. Remote-friendly across India."
        centered
        className="pt-24"
      />

      <Section>
        {roles.length === 0 ? (
          <Reveal>
            <Card className="text-center">
              <h2 className="text-xl font-bold">No open roles right now</h2>
              <p className="mt-3 text-muted-foreground">
                {source === "empty"
                  ? "We don't have published openings at the moment. Check back soon or send a general application."
                  : "We couldn't load current openings. Please try again shortly or reach out directly."}
              </p>
              <Link
                href="/contact?intent=careers"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                General application
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Card>
          </Reveal>
        ) : (
          <div className="grid gap-6">
            {roles.map((role, i) => (
              <Reveal key={role.slug} delay={i * 0.08}>
                <Card hover>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold">{role.title}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{role.department}</Badge>
                        <Badge variant="outline">{role.type}</Badge>
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" aria-hidden />
                          {role.location}
                        </span>
                      </div>
                      <p className="mt-3 text-muted-foreground">{role.summary}</p>
                    </div>
                    <Link
                      href={`/careers/${role.slug}`}
                      className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      View role
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CTABand
        title="Don't see your role?"
        description="Send us your resume — we're always interested in exceptional engineers and operators."
        primaryLabel="General application"
        primaryHref="/contact?intent=careers"
      />
    </>
  );
}
