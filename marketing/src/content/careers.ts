export type CareerRole = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export const roles: CareerRole[] = [
  {
    slug: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Bengaluru / Remote (India)",
    type: "Full-time",
    summary:
      "Build the core platform services — multi-tenant APIs, mail ingestion, billing integrations — that power Prabhix products at scale.",
    responsibilities: [
      "Design and implement REST APIs in Java 21 / Spring Boot with strict tenant isolation",
      "Own performance-critical paths: cursor pagination, outbox workers, Redis caching",
      "Write Flyway migrations that are safe to run against live production tables",
      "Participate in architecture reviews and mentor mid-level engineers",
    ],
    requirements: [
      "5+ years of backend development with production Java experience",
      "Strong PostgreSQL skills — indexing, query plans, partitioning concepts",
      "Experience with multi-tenant SaaS or similarly complex data models",
      "Comfort with Docker, CI/CD, and observability basics",
    ],
    niceToHave: [
      "Prior work on email systems (IMAP/SMTP, MIME parsing, threading)",
      "Razorpay or Stripe payment integration experience",
      "Contributions to open-source Java projects",
    ],
  },
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Bengaluru / Remote (India)",
    type: "Full-time",
    summary:
      "Ship polished, accessible interfaces for the Prabhix customer app and marketing surfaces using React, TypeScript, and Tailwind CSS.",
    responsibilities: [
      "Build responsive UI components with React 19, TypeScript strict mode, and TanStack Query",
      "Collaborate with design on interaction patterns, loading states, and error handling",
      "Implement RBAC-aware UI that adapts to user permissions without leaking data",
      "Write component tests and contribute to frontend performance budgets",
    ],
    requirements: [
      "3+ years of professional React experience with TypeScript",
      "Solid understanding of accessibility (WCAG 2.1 AA) and semantic HTML",
      "Experience with REST APIs, form validation (Zod), and client-side state management",
      "Eye for detail — you care about pixel alignment and micro-interactions",
    ],
    niceToHave: [
      "Next.js App Router experience",
      "Framer Motion or similar animation libraries",
      "Experience building admin dashboards or B2B SaaS products",
    ],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote (India)",
    type: "Full-time",
    summary:
      "Operate and evolve the Prabhix infrastructure — Docker, AWS, Caddy TLS, Postgres, Redis — with a focus on reliability and cost efficiency.",
    responsibilities: [
      "Maintain Docker Compose and production deployment pipelines to AWS EC2",
      "Manage Caddy reverse proxy configuration, automatic TLS, and routing rules",
      "Monitor Postgres and Redis health; tune connection pooling with PgBouncer",
      "Implement backup strategies, disaster recovery runbooks, and incident response",
    ],
    requirements: [
      "4+ years of DevOps/SRE experience with Linux server administration",
      "Hands-on Docker and container orchestration experience",
      "AWS EC2, VPC, security groups, and S3 familiarity",
      "Comfort writing infrastructure-as-code and operational documentation",
    ],
    niceToHave: [
      "Postfix/Dovecot mail server experience",
      "Grafana/Prometheus or similar observability stacks",
      "Experience scaling PostgreSQL for high-traffic SaaS workloads",
    ],
  },
];

export function getRole(slug: string): CareerRole | undefined {
  return roles.find((r) => r.slug === slug);
}
