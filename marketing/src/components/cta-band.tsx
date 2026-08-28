import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Container } from "./Container";
import { GradientMesh } from "./gradient-mesh";
import { Reveal } from "./Reveal";

type CTABandProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function CTABand({
  title,
  description,
  primaryLabel = "Book a demo",
  primaryHref = "/contact?intent=demo",
  secondaryLabel = "View pricing",
  secondaryHref = "/pricing",
  className,
}: CTABandProps) {
  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28", className)}>
      <GradientMesh />
      <Container>
        <Reveal>
          <div className="glass relative mx-auto max-w-3xl rounded-3xl px-8 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href={primaryHref} size="lg">
                {primaryLabel}
              </Button>
              {secondaryLabel && secondaryHref && (
                <Button href={secondaryHref} variant="secondary" size="lg">
                  {secondaryLabel}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
