"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import { GradientMesh } from "@/components/gradient-mesh";
import { Section } from "@/components/Section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative overflow-hidden">
      <GradientMesh />
      <Section
        eyebrow="Error"
        title="Something went wrong"
        description="An unexpected error occurred. You can try again, or contact us if the problem persists."
        titleAs="h1"
        centered
        className="relative min-h-[60vh] pt-24"
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </Section>
    </div>
  );
}
