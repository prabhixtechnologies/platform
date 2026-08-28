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
      aria-label="Prabhix Technologies home"
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
          d="M10 24V12h4.2c3.2 0 5.3 1.8 5.3 4.5 0 2.1-1.2 3.5-3 4.1l4.5 3.4h-3.4l-3.8-3H14.2v3H10zm4.1-6.2c1.5 0 2.4-.8 2.4-2s-.9-2-2.4-2H14.2v4h-.1z"
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
