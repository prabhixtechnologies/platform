import { formatMoney } from "@prabhix/oneops-api";

interface MoneyProps {
  amountPaise: number;
  currency?: string;
  className?: string;
  compareAtPaise?: number | null;
}

export function Money({
  amountPaise,
  currency = "INR",
  className,
  compareAtPaise,
}: MoneyProps) {
  return (
    <span className={className}>
      {compareAtPaise != null && compareAtPaise > amountPaise && (
        <span className="mr-2 text-sm text-muted-foreground line-through">
          {formatMoney(compareAtPaise, currency)}
        </span>
      )}
      <span>{formatMoney(amountPaise, currency)}</span>
    </span>
  );
}
