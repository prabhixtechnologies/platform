import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-strong shadow-lg shadow-primary/25",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-card",
  ghost: "text-foreground hover:bg-surface",
  accent:
    "bg-accent text-primary-foreground hover:brightness-110 shadow-lg shadow-accent/20",
} as const;

const sizes = {
  sm: "min-h-11 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
} as const;

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  /** Playwright and other tests target this; forwarded onto the real control. */
  "data-testid"?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  type = "button",
  disabled,
  onClick,
  "data-testid": testId,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          data-testid={testId}
        >
          {children}
          {/* target="_blank" moves the user to a new tab with no warning, which is disorienting for
              anyone who cannot see it happen and leaves the back button dead. Announce it. */}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} data-testid={testId}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
