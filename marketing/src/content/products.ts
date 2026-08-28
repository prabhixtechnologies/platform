import { appUrls, type AppKey } from "@/lib/site-config";

/**
 * What Prabhix sells, split by what the thing actually *is*. Conflating these is what made the
 * site confusing: every entry rendered an "Open app" button, including two that had no app to
 * open and pointed at a contact form instead.
 *
 * - `app`    — a product with its own deployment and URL you can sign in to (MobiStack, OneOps).
 * - `module` — a capability *inside* OneOps. Sold as part of a plan, not separately deployed, so
 *              it has no URL of its own and must never offer "Open app".
 *
 * Physical goods, digital downloads and service engagements are not here at all: those are real
 * SKUs managed in OneOps and served from the backend to `/shop`.
 */
export type ProductKind = "app" | "module";

type ProductBase = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  status: "live" | "coming-soon";
};

export type Product = ProductBase &
  (
    | {
        kind: "app";
        /** Key into `appUrls`, so the URL has exactly one definition. */
        app: AppKey;
      }
    | {
        kind: "module";
        /** The app this capability is reached inside. */
        partOf: AppKey;
      }
  );

export const products: Product[] = [
  {
    kind: "app",
    app: "oneops",
    slug: "oneops",
    name: "OneOps",
    tagline: "One console to run the whole business.",
    description:
      "OneOps is the operator console for the Prabhix platform. Shared team inbox, live chat with everyone on your site, customer and order management, staff and permissions, billing, and a full audit trail — in one place, on every screen size, with native apps for iOS and Android.",
    features: [
      "Shared team inbox with assignment, SLA tracking and canned replies",
      "Live chat with visitors, plus who is on your site right now",
      "Storefront administration: catalog, orders, customers, discounts",
      "Staff, teams and custom roles with fine-grained permissions",
      "Subscription, seats and GST invoicing via Razorpay",
      "Audit and event logs, searchable and exportable",
    ],
    status: "live",
  },
  {
    kind: "app",
    app: "mobistack",
    slug: "mobistack",
    name: "MobiStack",
    tagline: "Mobile repair shop management, end to end.",
    description:
      "MobiStack is a purpose-built platform for mobile repair businesses — inventory, repair workflows, point-of-sale, billing, and an offline-first technician app with part-compatibility intelligence.",
    features: [
      "Repair ticket lifecycle with status tracking and customer notifications",
      "Inventory with serial tracking and low-stock alerts",
      "Offline-first mobile app for technicians on the shop floor",
      "Part compatibility engine to reduce mis-orders and returns",
      "Integrated billing, GST invoicing, and Razorpay payments",
      "Multi-location support with role-based access",
    ],
    status: "live",
  },
  {
    kind: "module",
    partOf: "oneops",
    slug: "helpdesk",
    name: "Helpdesk",
    tagline: "Shared inbox and SLA tracking, built into OneOps.",
    description:
      "The email and helpdesk capability of OneOps — shared mailboxes, conversation threading, agent assignment, SLA tracking, and automation rules for support teams. Included with OneOps rather than deployed separately.",
    features: [
      "IMAP ingestion with MIME parsing and thread reconstruction",
      "Agent assignment with team-scoped visibility",
      "Configurable SLA thresholds and breach notifications",
      "Canned replies with variable substitution",
      "Audit trail on every ticket status change",
      "Available on Growth plans and above",
    ],
    status: "live",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** The URL to sign in to, or null for a capability that has no separate deployment. */
export function productAppUrl(product: Product): string | null {
  return product.kind === "app" ? appUrls[product.app] : null;
}

export const productApps = products.filter(
  (p): p is Product & { kind: "app" } => p.kind === "app",
);
