import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageMetaOptions = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
}: PageMetaOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle ?? title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
    description: siteConfig.tagline,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    sameAs: [],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/products/${product.slug}`,
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon` },
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${article.slug}`,
  };
}

export function jobPostingJsonLd(role: {
  title: string;
  summary: string;
  slug: string;
  location: string;
  type: string;
  department: string;
}) {
  const employmentMap: Record<string, string> = {
    "Full-time": "FULL_TIME",
    Contract: "CONTRACTOR",
    Internship: "INTERN",
  };

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: role.summary,
    datePosted: new Date().toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: role.location,
        addressCountry: "IN",
      },
    },
    employmentType: employmentMap[role.type] ?? "FULL_TIME",
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.name,
      value: role.slug,
    },
    occupationalCategory: role.department,
    url: `${siteConfig.url}/careers/${role.slug}`,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
