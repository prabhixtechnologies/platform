export type ApiErrorBody = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
};

export class CommerceApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "CommerceApiError";
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}

const FRIENDLY: Record<string, string> = {
  OUT_OF_STOCK: "This item is out of stock. Reduce the quantity or choose another variant.",
  CART_EMPTY: "Your cart is empty. Add items before checkout.",
  DISCOUNT_INVALID: "That discount code is not valid for this cart.",
  PRODUCT_UNAVAILABLE: "This product is no longer available.",
  ORDER_ALREADY_PAID: "This order has already been paid. Check your order confirmation.",
  DOWNLOAD_LINK_EXPIRED: "This download link has expired or reached its download limit.",
  PRODUCT_NOT_FOUND: "That product could not be found.",
  CART_NOT_FOUND: "Your cart has expired. Please start again.",
  ORDER_NOT_FOUND: "No order found. If you completed a purchase, use the link from your confirmation email.",
  VARIANT_NOT_FOUND: "That product variant is no longer available.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  ORIGIN_NOT_ALLOWED: "This store cannot be accessed from this site.",
  PAYMENT_SIGNATURE_MISMATCH: "Payment verification failed. If you were charged, contact support with your payment ID.",
  ORDER_NOT_PAYABLE: "This order cannot be paid in its current state.",
};

export function friendlyCommerceError(err: unknown): string {
  if (err instanceof CommerceApiError) {
    return FRIENDLY[err.code] ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
