declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
};

export type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
};

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loadPromise: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });

  return loadPromise;
}

export async function openRazorpayCheckout(
  options: RazorpayOptions,
): Promise<
  | { status: "success"; paymentId: string; orderId: string; signature: string }
  | { status: "dismissed" }
  | { status: "failed"; message: string }
> {
  await loadRazorpay();
  if (!window.Razorpay) {
    return { status: "failed", message: "Payment provider failed to load" };
  }

  return new Promise((resolve) => {
    const rzp = new window.Razorpay!({
      ...options,
      handler(response) {
        resolve({
          status: "success",
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ...options.modal,
        ondismiss() {
          options.modal?.ondismiss?.();
          resolve({ status: "dismissed" });
        },
      },
    });

    rzp.on("payment.failed", (resp: unknown) => {
      const message =
        typeof resp === "object" &&
        resp !== null &&
        "error" in resp &&
        typeof (resp as { error?: { description?: string } }).error?.description ===
          "string"
          ? (resp as { error: { description: string } }).error.description
          : "Payment failed";
      resolve({ status: "failed", message });
    });

    rzp.open();
  });
}
