import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/json-ld";
import { formatDate } from "@/lib/utils";
import { getPost, posts } from "@/content/posts";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            date: post.date,
            author: post.author,
          }),
        ]}
      />
      <Section className="pt-24">
        <Reveal>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to blog
          </Link>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {post.author} · {formatDate(post.date)} · {post.readTime} read
          </p>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <article className="prose prose-lg max-w-3xl text-muted-foreground">
            {post.content.map((paragraph) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <h2
                    key={paragraph}
                    className="mt-8 text-xl font-semibold text-foreground"
                  >
                    {paragraph.replace(/\*\*/g, "")}
                  </h2>
                );
              }
              return (
                <p key={paragraph} className="mt-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </article>
        </Reveal>
      </Section>
    </>
  );
}
