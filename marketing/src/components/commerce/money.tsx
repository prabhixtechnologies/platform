import { formatMoney } from "@/lib/commerce/money";

interface MoneyProps {
  amountMinor: number;
  currency?: string;
  className?: string;
  compareAtMinor?: number | null;
}

export function Money({
  amountMinor,
  currency = "INR",
  className,
  compareAtMinor,
}: MoneyProps) {
  return (
    <span className={className}>
      {compareAtMinor != null && compareAtMinor > amountMinor && (
        <span className="mr-2 text-sm text-muted-foreground line-through">
          {formatMoney(compareAtMinor, currency)}
        </span>
      )}
      <span>{formatMoney(amountMinor, currency)}</span>
    </span>
  );
}
