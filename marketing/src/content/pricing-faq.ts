export const pricingFaqItems = [
  {
    id: "billing",
    question: "How does billing work?",
    answer:
      "All paid plans are billed through Razorpay in INR. Subscriptions renew monthly or annually (20% discount on annual). Invoices include GST where applicable. You can upgrade, downgrade, or cancel from your organization settings.",
  },
  {
    id: "trial",
    question: "Is there a free trial?",
    answer:
      "The Starter plan is free forever with limited users and features. Growth and Business plans include a 14-day trial with full feature access — no credit card required to start.",
  },
  {
    id: "seats",
    question: "What happens if I exceed my user limit?",
    answer:
      "You'll be prompted to upgrade before adding members beyond your plan limit. Existing users are never locked out — we give a grace period to adjust your subscription.",
  },
  {
    id: "annual",
    question: "How does the annual discount work?",
    answer:
      "Annual billing charges 12 months at 80% of the monthly rate — a 20% savings. Annual plans are prepaid and non-refundable after 30 days, but you can switch to monthly at renewal.",
  },
  {
    id: "enterprise",
    question: "What's included in Enterprise?",
    answer:
      "Enterprise includes custom user limits (up to 100k per organization), dedicated support, SSO, custom DPAs, security reviews, and optional dedicated infrastructure. Pricing is based on users, modules, and support tier.",
  },
] as const;
