import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { formatDate } from "@/lib/utils";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering insights from the Prabhix team — multi-tenancy, billing, offline-first mobile, and platform architecture.",
};

export default function BlogPage() {
  return (
    <>
      <Section
        eyebrow="Blog"
        title="Engineering & product insights"
        description="Technical writing from the team building the Prabhix platform and MobiStack."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-8">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <Card hover>
                <article>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {post.author} · {formatDate(post.date)} · {post.readTime} read
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Read article
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
