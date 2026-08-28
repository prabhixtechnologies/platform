import { z } from "zod";

export const productTypeSchema = z.enum([
  "SUBSCRIPTION",
  "DIGITAL",
  "SERVICE",
  "PHYSICAL",
]);

export const billingIntervalSchema = z.enum(["MONTHLY", "ANNUAL", "ONE_TIME"]);

export const productSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string().nullable().optional(),
  productType: productTypeSchema,
  featured: z.boolean(),
  heroImageFileId: z.string().uuid().nullable().optional(),
  fromPriceMinor: z.number(),
  currency: z.string(),
});

export const variantViewSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  priceMinor: z.number(),
  compareAtPriceMinor: z.number().nullable().optional(),
  currency: z.string(),
  trackInventory: z.boolean(),
  stockAvailable: z.number().nullable().optional(),
  billingInterval: billingIntervalSchema.nullable().optional(),
  downloadFileId: z.string().uuid().nullable().optional(),
  serviceDurationDays: z.number().nullable().optional(),
  deliverySlaDays: z.number().nullable().optional(),
  active: z.boolean(),
});

export const productDetailSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  productType: productTypeSchema,
  status: z.string(),
  featured: z.boolean(),
  heroImageFileId: z.string().uuid().nullable().optional(),
  galleryFileIds: z.array(z.string().uuid()).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  hsnCode: z.string().nullable().optional(),
  attributes: z.record(z.unknown()).nullable().optional(),
  variants: z.array(variantViewSchema),
  categoryIds: z.array(z.string().uuid()).optional(),
  publishedAt: z.string().nullable().optional(),
});

export const cursorPageSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    // nullish, not nullable: the last page has no cursor, and a server configured to omit nulls
    // sends no key at all. Both mean the same thing to a caller, so neither should throw.
    nextCursor: z.string().nullish().transform((value) => value ?? null),
    hasMore: z.boolean().default(false),
  });

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  productName: z.string(),
  variantName: z.string(),
  sku: z.string(),
  quantity: z.number(),
  unitPriceMinor: z.number(),
  lineTotalMinor: z.number(),
});

export const cartViewSchema = z.object({
  cartToken: z.string(),
  currency: z.string(),
  items: z.array(cartItemSchema),
  subtotalMinor: z.number(),
  discountMinor: z.number(),
  taxMinor: z.number(),
  shippingMinor: z.number(),
  totalMinor: z.number(),
  discountCode: z.string().nullable().optional(),
  expiresAt: z.string(),
});

export const createCartResponseSchema = z.object({
  cartToken: z.string(),
  cart: cartViewSchema,
});

export const checkoutResponseSchema = z.object({
  orderId: z.string().uuid(),
  orderNumber: z.string(),
  accessToken: z.string(),
  totalMinor: z.number(),
  currency: z.string(),
  razorpayOrderId: z.string(),
  razorpayKeyId: z.string(),
  razorpayNotes: z.record(z.string()).optional(),
});

export const verifyPaymentResponseSchema = z.object({
  orderId: z.string().uuid(),
  orderNumber: z.string(),
  status: z.string(),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  productName: z.string(),
  variantName: z.string(),
  sku: z.string(),
  productType: productTypeSchema,
  quantity: z.number(),
  unitPriceMinor: z.number(),
  lineSubtotalMinor: z.number(),
});

export const orderDetailSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  status: z.string(),
  accessToken: z.string(),
  subtotalMinor: z.number(),
  discountMinor: z.number(),
  cgstMinor: z.number(),
  sgstMinor: z.number(),
  igstMinor: z.number(),
  shippingMinor: z.number(),
  totalMinor: z.number(),
  currency: z.string(),
  customerEmail: z.string().nullable().optional(),
  customerName: z.string().nullable().optional(),
  items: z.array(orderItemSchema),
  addresses: z.array(
    z.object({
      addressType: z.string(),
      name: z.string(),
      line1: z.string(),
      line2: z.string().nullable().optional(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      phone: z.string().nullable().optional(),
    }),
  ),
  events: z.array(
    z.object({
      eventType: z.string(),
      message: z.string(),
      createdAt: z.string(),
    }),
  ),
  invoiceId: z.string().uuid().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  fulfilledAt: z.string().nullable().optional(),
  internalNote: z.string().nullable().optional(),
});

export const downloadLinkResponseSchema = z.object({
  downloadUrl: z.string(),
  expiresAt: z.string(),
});

export type ProductSummary = z.infer<typeof productSummarySchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type ProductType = z.infer<typeof productTypeSchema>;
export type CartView = z.infer<typeof cartViewSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type VariantView = z.infer<typeof variantViewSchema>;
