import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { changelog } from "@/content/changelog";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description: "Release notes and platform updates from Prabhix Technologies.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <>
      <Section
        eyebrow="Changelog"
        title="Release notes"
        description="What shipped on the Prabhix platform and products — documented for operators and developers."
        centered
        className="pt-24"
      />

      <Section className="pt-0">
        <div className="mx-auto max-w-3xl space-y-8">
          {changelog.map((entry, i) => (
            <Reveal key={entry.version} delay={i * 0.06}>
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{entry.version}</Badge>
                  <time dateTime={entry.date} className="text-sm text-muted-foreground">
                    {formatDate(entry.date)}
                  </time>
                </div>
                <h2 className="mt-4 text-xl font-bold">{entry.title}</h2>
                <ul className="mt-4 space-y-2">
                  {entry.changes.map((change) => (
                    <li key={change} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                      {change}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
