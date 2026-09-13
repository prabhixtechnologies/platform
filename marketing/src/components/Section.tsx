import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  centered?: boolean;
  titleAs?: "h1" | "h2";
};

export function Section({
  children,
  className,
  id,
  eyebrow,
  title,
  description,
  centered = false,
  titleAs: TitleTag = "h2",
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container>
        {(eyebrow || title || description) && (
          <header
            className={cn(
              "mb-12 max-w-3xl",
              centered && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <TitleTag className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </TitleTag>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
