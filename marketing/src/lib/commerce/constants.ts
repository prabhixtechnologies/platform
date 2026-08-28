import type { ProductType } from "@/lib/commerce/schemas";
import {
  Download,
  Package,
  RefreshCw,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  SUBSCRIPTION: "Subscription",
  DIGITAL: "Digital download",
  SERVICE: "Service",
  PHYSICAL: "Physical product",
};

export const PRODUCT_TYPE_ICONS: Record<ProductType, LucideIcon> = {
  SUBSCRIPTION: RefreshCw,
  DIGITAL: Download,
  SERVICE: Wrench,
  PHYSICAL: Package,
};

export const PRODUCT_TYPE_DESCRIPTIONS: Record<ProductType, string> = {
  SUBSCRIPTION: "Recurring billing — access continues while your plan is active.",
  DIGITAL: "Instant delivery — download your files after payment.",
  SERVICE: "Expert delivery — we schedule and fulfil the engagement after purchase.",
  PHYSICAL: "Shipped to your door — enter a delivery address at checkout.",
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
