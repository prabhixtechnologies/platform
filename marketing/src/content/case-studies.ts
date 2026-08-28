export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "regional-repair-chain-digital-ops",
    title: "Unified operations for a 12-location repair chain",
    client: "Regional mobile repair chain (India)",
    industry: "Consumer electronics repair",
    summary:
      "A growing repair chain needed to replace spreadsheets and disconnected POS systems with a single platform that technicians could use offline on busy shop floors.",
    challenge:
      "Each location ran its own inventory spreadsheet and paper repair slips. Part ordering was reactive, leading to stockouts on high-turnover SKUs. Technicians had no way to verify part compatibility before ordering, and billing reconciliation across locations took days each month.",
    solution:
      "Prabhix deployed MobiStack across all 12 locations with centralized inventory visibility, standardized repair workflows, and the offline-first technician app. Part compatibility rules were configured for the top 40 device families the chain services, reducing wrong-part orders at the source.",
    results: [
      "Repair ticket creation time dropped from an average of 4 minutes (paper + re-entry) to under 60 seconds.",
      "Inventory accuracy improved from estimated 78% to above 96% within the first quarter.",
      "Monthly billing reconciliation consolidated from a 3-day process to same-day automated reports.",
      "Technicians adopted the mobile app within two weeks — 89% of tickets now originate on-device.",
    ],
    metrics: [
      { label: "Locations", value: "12" },
      { label: "Technicians onboarded", value: "48" },
      { label: "Avg. ticket time saved", value: "3 min" },
      { label: "Inventory accuracy", value: "96%+" },
    ],
  },
  {
    slug: "b2b-support-inbox-consolidation",
    title: "Consolidating support mail for a growing SaaS vendor",
    client: "Mid-market B2B software company (India)",
    industry: "Business software",
    summary:
      "A SaaS vendor with a growing customer base needed to replace ad-hoc Gmail forwarding with a shared inbox that could track SLAs and assign conversations to the right team.",
    challenge:
      "Support requests arrived across three shared mailboxes with no assignment rules. Agents duplicated replies because threading was lost when messages were forwarded internally. Leadership had no visibility into response times or backlog age.",
    solution:
      "Prabhix deployed the platform shared inbox module with IMAP ingestion for existing mailboxes, team-scoped assignment rules, and SLA thresholds aligned to their published support policy. Canned replies covered the top twenty request categories.",
    results: [
      "Median first-response time dropped from 11 hours to under 4 hours within six weeks.",
      "Duplicate replies fell sharply once threading and assignment were centralized.",
      "Monthly support review meetings replaced inbox archaeology with SLA dashboards.",
      "Audit log export satisfied a customer security questionnaire without manual evidence gathering.",
    ],
    metrics: [
      { label: "Shared mailboxes", value: "3" },
      { label: "Support agents", value: "8" },
      { label: "Median first response", value: "<4h" },
      { label: "SLA categories tracked", value: "4" },
    ],
  },
  {
    slug: "field-service-offline-rollout",
    title: "Offline-first rollout for a field service operation",
    client: "Regional field service provider (India)",
    industry: "On-site equipment servicing",
    summary:
      "A field service team needed technicians to log job notes, parts used, and customer signatures without depending on warehouse Wi-Fi or mobile data coverage.",
    challenge:
      "Technicians skipped digital logging when connectivity was poor, forcing evening data entry at the depot. Parts consumption was reconciled days late, and customer sign-off lived on paper that could be lost in transit.",
    solution:
      "Prabhix extended the offline-first mobile patterns proven in MobiStack to a custom field-service workflow — local-first job records, queued sync on reconnect, and photo attachments stored until upload succeeded.",
    results: [
      "Same-day job closure rate improved once technicians could complete workflows entirely on-device.",
      "Parts consumption synced automatically, reducing end-of-week inventory adjustments.",
      "Customer signatures captured digitally eliminated lost paper receipts.",
    ],
    metrics: [
      { label: "Field technicians", value: "22" },
      { label: "Daily jobs (avg.)", value: "140" },
      { label: "Offline sync success", value: "99%+" },
      { label: "Paper forms eliminated", value: "100%" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
