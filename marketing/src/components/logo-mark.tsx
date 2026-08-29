import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  showWordmark?: boolean;
};

export function LogoMark({ className, showWordmark = true }: LogoMarkProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group", className)}
      // Named by the wordmark when it is on screen, so the accessible name contains the words a
      // visitor can read and voice control can act on them. A fixed aria-label of "Prabhix
      // Technologies home" used to override it, and WCAG's label-in-name rule failed: the visible
      // text is not a part of that string. Only the icon-only form needs a name supplied.
      aria-label={showWordmark ? undefined : "Prabhix Technologies"}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="36" height="36" rx="10" className="fill-primary" />
        <path
          d="M10 24V12h4.2c3.2 0 5 1.8 5 3.7 0 1.9-1.9 3.8-5 3.8v4.5H10zm4.2-6.5h2c1.1 0 1.8-.6 1.8-1.5 0-.9-.7-1.5-1.8-1.5h-2z"
          fill="white"
        />
        <path
          d="M22.5 12h3.5l5 12h-3.7l-.9-2.3h-4.5l-.9 2.3H17l5.5-12zm2.2 7.1l-1.5-3.8-1.5 3.8h3z"
          fill="#22D3EE"
        />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Prabhix
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Technologies
          </span>
        </span>
      )}
    </Link>
  );
}
