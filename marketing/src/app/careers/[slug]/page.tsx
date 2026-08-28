import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { ApplicationForm } from "@/components/forms/application-form";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { getCareerBySlug, getCareerSlugs } from "@/lib/careers-api";
import { breadcrumbJsonLd, jobPostingJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCareerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { role } = await getCareerBySlug(slug);
  if (!role) return { title: "Role not found" };
  return pageMetadata({
    title: `${role.title} — Careers`,
    description: role.summary,
    path: `/careers/${slug}`,
  });
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const { role } = await getCareerBySlug(slug);
  if (!role) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: role.title, path: `/careers/${slug}` },
          ]),
          jobPostingJsonLd(role),
        ]}
      />
      <Section className="pt-24">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{role.department}</Badge>
            <Badge variant="outline">{role.type}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {role.title}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {role.location}
          </p>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            {role.summary}
          </p>
        </Reveal>
      </Section>

      <Section eyebrow="Responsibilities" title="What you'll do" className="bg-surface/30 pt-0">
        <Reveal>
          <ul className="max-w-3xl space-y-3">
            {role.responsibilities.map((item) => (
              <li key={item} className="flex gap-3 text-muted-foreground">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section eyebrow="Requirements" title="What we're looking for">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <Card>
              <h3 className="font-semibold">Required</h3>
              <ul className="mt-4 space-y-2">
                {role.requirements.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          {role.niceToHave.length > 0 && (
            <Reveal delay={0.1}>
              <Card>
                <h3 className="font-semibold">Nice to have</h3>
                <ul className="mt-4 space-y-2">
                  {role.niceToHave.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          )}
        </div>
      </Section>

      <Section eyebrow="Apply" title="Submit your application" className="bg-surface/30">
        <Reveal>
          <Card className="max-w-2xl">
            <ApplicationForm roleSlug={role.slug} roleTitle={role.title} />
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
