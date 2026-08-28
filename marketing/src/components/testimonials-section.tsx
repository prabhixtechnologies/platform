import { Card } from "./Card";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const testimonials = [
  {
    quote:
      "MobiStack replaced three disconnected tools at our repair chain. Technicians actually use the mobile app because it works offline — that alone changed our ticket throughput.",
    role: "Operations lead",
    industry: "Multi-location repair chain",
  },
  {
    quote:
      "The shared inbox and SLA tracking gave our support team one queue instead of forwarding threads across personal mailboxes. Response times are measurable now.",
    role: "Head of customer success",
    industry: "B2B SaaS customer",
  },
  {
    quote:
      "We evaluated several platforms for tenant isolation and audit requirements. Prabhix documented their three-layer model clearly — that transparency mattered for our security review.",
    role: "IT director",
    industry: "Enterprise services firm",
  },
];

export function TestimonialsSection() {
  return (
    <Section
      eyebrow="Trusted by operators"
      title="What teams say about working with Prabhix"
      description="Anonymised feedback from platform and product customers. No fabricated logos or vanity metrics."
      className="bg-surface/30"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={item.role} delay={i * 0.08}>
            <Card className="flex h-full flex-col">
              <blockquote className="flex-1 text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{item.role}</p>
                <p className="text-sm text-muted-foreground">{item.industry}</p>
              </footer>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
