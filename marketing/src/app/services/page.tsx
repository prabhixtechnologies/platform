import type { Metadata } from "next";
import {
  Brain,
  Cloud,
  Code2,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/Card";
import { CTABand } from "@/components/cta-band";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Prabhix Technologies services — custom software development, cloud & DevOps, AI/ML integration, mobile apps, and enterprise consulting.",
};

const services = [
  {
    icon: Code2,
    title: "Custom software development",
    description:
      "Full-stack application development on the Prabhix platform or as standalone systems. Java/Spring Boot backends, React/Next.js frontends, PostgreSQL data models with proper tenant isolation.",
    deliverables: [
      "Requirements discovery and technical specification",
      "API design with OpenAPI documentation",
      "CI/CD pipeline and Docker deployment",
      "Handoff documentation and team training",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Infrastructure design and operations for AWS deployments — Docker Compose to EC2, Caddy TLS termination, Postgres with PgBouncer, Redis, and observability setup.",
    deliverables: [
      "Infrastructure architecture and cost modelling",
      "Docker image builds and deployment automation",
      "Backup, disaster recovery, and runbook creation",
      "Performance tuning and connection pool optimization",
    ],
  },
  {
    icon: Brain,
    title: "AI & ML integration",
    description:
      "Practical AI features embedded in business workflows — document classification for helpdesk routing, part compatibility inference, demand forecasting for inventory, and natural-language search.",
    deliverables: [
      "Use-case assessment and feasibility analysis",
      "Model selection, fine-tuning, or RAG pipeline design",
      "Integration with existing Prabhix modules",
      "Evaluation metrics and monitoring dashboards",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile applications",
    description:
      "Offline-first mobile apps for field teams — local SQLite storage, background sync, push notifications, and domain-specific conflict resolution. Proven patterns from MobiStack.",
    deliverables: [
      "Cross-platform or native mobile development",
      "Offline sync architecture and conflict rules",
      "App store submission and update management",
      "Device management and security hardening",
    ],
  },
  {
    icon: MessageSquare,
    title: "Enterprise consulting",
    description:
      "Architecture reviews, multi-tenancy design, RBAC modelling, mail system integration, and Razorpay billing setup for teams building or migrating to SaaS.",
    deliverables: [
      "Architecture review and gap analysis",
      "Migration planning from legacy systems",
      "Security and compliance assessment",
      "Team workshops and pair-programming sessions",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section
        eyebrow="Services"
        title="Expertise beyond the platform"
        description="We partner with organizations to build custom software, deploy infrastructure, and integrate AI — on the Prabhix stack or yours."
        centered
        className="pt-24"
      />

      <Section>
        <div className="grid gap-8">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <Card>
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="shrink-0">
                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <service.icon className="size-6 text-primary" aria-hidden />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{service.title}</h2>
                    <p className="mt-3 text-muted-foreground">
                      {service.description}
                    </p>
                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Typical deliverables
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {service.deliverables.map((d) => (
                        <li key={d} className="text-sm text-muted-foreground">
                          • {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand
        title="Discuss your project"
        description="Tell us about your requirements — we'll propose an approach, timeline, and engagement model."
        primaryLabel="Contact us"
        primaryHref="/contact"
      />
    </>
  );
}
