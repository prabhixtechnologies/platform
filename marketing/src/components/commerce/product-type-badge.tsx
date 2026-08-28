import { Badge } from "@/components/Badge";
import {
  PRODUCT_TYPE_ICONS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/commerce/constants";
import type { ProductType } from "@/lib/commerce/schemas";
import { cn } from "@/lib/utils";

interface ProductTypeBadgeProps {
  type: ProductType;
  className?: string;
}

export function ProductTypeBadge({ type, className }: ProductTypeBadgeProps) {
  const Icon = PRODUCT_TYPE_ICONS[type];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-normal", className)}>
      <Icon className="size-3.5" aria-hidden />
      {PRODUCT_TYPE_LABELS[type]}
    </Badge>
  );
}
