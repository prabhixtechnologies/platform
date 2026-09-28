import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        // The generated subtle pairs rather than an alpha tint carrying the accent itself. An
        // alpha tint tracks the accent's lightness, so the two never separate far enough:
        // measured, `bg-accent/10 text-accent` was 4.15:1 in light mode and 4.26:1 in dark. The
        // pairs below are asserted at 4.5:1 on every run and measure 6.84:1 at worst.
        variant === "default" && "bg-accent-subtle text-accent-subtle-ink",
        variant === "accent" && "bg-accent-2-subtle text-accent-2-subtle-ink",
        variant === "outline" && "border border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
