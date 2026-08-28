export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "2026.08",
    date: "2026-08-15",
    title: "Marketing site & self-serve onboarding",
    changes: [
      "Public marketing site with platform, pricing, and careers pages",
      "Self-serve organization signup flow in the customer console",
      "Site API endpoints for leads, subscribers, and job applications",
    ],
  },
  {
    version: "2026.06",
    date: "2026-06-02",
    title: "Audit log export & DPA templates",
    changes: [
      "CSV and JSON audit log export for Business and Enterprise plans",
      "Published security documentation and standard DPA for enterprise customers",
      "Monthly table partitioning on audit_events for query performance",
    ],
  },
  {
    version: "2026.04",
    date: "2026-04-18",
    title: "Shared inbox SLA automation",
    changes: [
      "SLA breach detection with configurable thresholds per mailbox",
      "Canned reply templates with variable substitution",
      "Agent assignment rules based on team membership",
    ],
  },
  {
    version: "2026.02",
    date: "2026-02-10",
    title: "Razorpay subscription hardening",
    changes: [
      "Webhook idempotency keys on all billing state transitions",
      "Seat-based proration on mid-cycle plan changes",
      "GST line items on generated invoices",
    ],
  },
  {
    version: "2025.11",
    date: "2025-11-20",
    title: "MobiStack multi-location rollout",
    changes: [
      "Cross-location inventory transfers with audit trail",
      "Location-scoped RBAC roles for shop managers",
      "Offline sync conflict resolution improvements on technician app",
    ],
  },
];
