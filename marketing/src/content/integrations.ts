export type Integration = {
  name: string;
  category: string;
  description: string;
  status: "available" | "planned";
};

export const integrations: Integration[] = [
  {
    name: "Razorpay",
    category: "Payments",
    description:
      "Subscriptions, one-time payments, GST invoicing, and webhook-driven entitlement updates.",
    status: "available",
  },
  {
    name: "Amazon Web Services",
    category: "Infrastructure",
    description:
      "EC2 compute, S3-compatible object storage, and ap-south-1 data residency for Indian deployments.",
    status: "available",
  },
  {
    name: "IMAP / SMTP",
    category: "Email",
    description:
      "Shared mailbox ingestion, outbound transactional mail, and custom domain routing.",
    status: "available",
  },
  {
    name: "REST API",
    category: "Developer",
    description:
      "OpenAPI-documented endpoints with JWT authentication and organization-scoped tenancy headers.",
    status: "available",
  },
  {
    name: "Webhooks",
    category: "Developer",
    description:
      "Outbound event notifications for billing, mail, and organization membership changes.",
    status: "available",
  },
  {
    name: "SSO / SAML",
    category: "Identity",
    description:
      "Enterprise single sign-on with SAML 2.0 identity provider integration.",
    status: "planned",
  },
  {
    name: "Slack",
    category: "Notifications",
    description:
      "Helpdesk alerts and SLA breach notifications delivered to team channels.",
    status: "planned",
  },
  {
    name: "Zapier",
    category: "Automation",
    description:
      "No-code workflow triggers for lead capture and ticket status changes.",
    status: "planned",
  },
];

export const partners = [
  {
    name: "Implementation partners",
    description:
      "Systems integrators who deploy MobiStack and Prabhix platform modules for mid-market customers.",
  },
  {
    name: "Technology partners",
    description:
      "ISVs building on the Prabhix API with co-marketed integration listings.",
  },
  {
    name: "Referral partners",
    description:
      "Consultants and agencies who introduce qualified enterprise opportunities.",
  },
];
