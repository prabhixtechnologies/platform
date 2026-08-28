import type { Metadata } from "next";
import { Calendar, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import {
  CONTACT_INTENT_MAP,
  resolveLeadInterest,
} from "@/lib/lead-interests";
import { siteConfig } from "@/lib/utils";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Prabhix Technologies — sales inquiries, demo requests, partnerships, and support.",
  path: "/contact",
});

const interestMap = CONTACT_INTENT_MAP;

type Props = {
  searchParams: Promise<{ intent?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const defaultInterest = resolveLeadInterest(
    interestMap[intent ?? ""] ?? "General inquiry",
  );
  const isDemo = intent === "demo";

  return (
    <>
      <Section
        eyebrow="Contact"
        title={isDemo ? "Book a demo" : "Get in touch"}
        description={
          isDemo
            ? "See the Prabhix platform or MobiStack in a live walkthrough tailored to your use case."
            : "Sales inquiries, partnerships, and general questions — we respond within one business day."
        }
        centered
        className="pt-24"
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Card>
              <ContactForm
                defaultInterest={defaultInterest}
                source={isDemo ? "demo-request" : "contact"}
              />
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="space-y-6">
              <Card>
                <div className="flex gap-4">
                  <Calendar className="size-6 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h2 className="font-semibold">Book a demo</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      30-minute walkthrough of the platform or MobiStack. No
                      commitment required.
                    </p>
                    <Button
                      href="/contact?intent=demo"
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                    >
                      Schedule via form
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex gap-4">
                  <Mail className="size-6 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h2 className="font-semibold">Email</h2>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="mt-2 block text-sm text-primary hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                    <p className="mt-2 text-sm text-muted-foreground">
                      careers@prabhixtechnologies.com for job applications
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex gap-4">
                  <MapPin className="size-6 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h2 className="font-semibold">Office</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {siteConfig.address}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Remote-first team across India. In-person meetings by
                      appointment.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
