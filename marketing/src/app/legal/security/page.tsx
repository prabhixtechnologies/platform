import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Security practices and controls for the Prabhix Technologies platform.",
};

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" lastUpdated="August 27, 2025">
      <section>
        <h2>Overview</h2>
        <p>
          Security is foundational to the Prabhix platform. Our multi-tenant
          architecture, mail subsystem, and billing integrations handle sensitive
          business data — we design for defence in depth, not checkbox compliance.
        </p>
      </section>

      <section>
        <h2>Infrastructure</h2>
        <ul>
          <li>
            Production workloads run on AWS EC2 with Docker, fronted by Caddy
            for automatic TLS (Let&apos;s Encrypt).
          </li>
          <li>
            PostgreSQL and Redis are not exposed to the public internet in
            production. Database access is restricted to application containers
            via private networking.
          </li>
          <li>
            Attachments and exports are stored in S3-compatible object storage
            with signed URLs — never in the database.
          </li>
          <li>
            Infrastructure secrets are managed via environment variables and are
            never committed to source control.
          </li>
        </ul>
      </section>

      <section>
        <h2>Application security</h2>
        <ul>
          <li>
            <strong>Authentication:</strong> JWT access tokens (15-minute TTL)
            with refresh token rotation. Optional SSO/SAML on Enterprise plans.
          </li>
          <li>
            <strong>Authorization:</strong> Fine-grained RBAC with permissions
            embedded in JWT claims. Declarative enforcement via Spring Security.
          </li>
          <li>
            <strong>Tenant isolation:</strong> Three redundant layers — JWT org
            claim, request-scoped TenantFilter, Hibernate query filters — plus
            Postgres row-level security on high-risk tables.
          </li>
          <li>
            <strong>Input validation:</strong> Jakarta Bean Validation on all API
            DTOs. Parameterized queries via JPA — no raw SQL concatenation.
          </li>
          <li>
            <strong>Rate limiting:</strong> Per-IP and per-organization token
            buckets in Redis.
          </li>
        </ul>
      </section>

      <section>
        <h2>Data protection</h2>
        <ul>
          <li>Encryption in transit: TLS 1.2+ on all endpoints</li>
          <li>Encryption at rest: AWS EBS and S3 default encryption</li>
          <li>
            Passwords hashed with bcrypt (or delegated to SSO provider on
            Enterprise)
          </li>
          <li>
            Audit logging: append-only trail for sensitive operations, partitioned
            and archived to S3 after 90 days
          </li>
        </ul>
      </section>

      <section>
        <h2>Email security</h2>
        <ul>
          <li>SPF, DKIM, and DMARC enforced on customer domains via our mail server</li>
          <li>Rspamd for inbound spam and malware filtering</li>
          <li>Inbound ingestion idempotent on RFC 5322 Message-ID</li>
          <li>Outbound mail via queued outbox — never direct SMTP in request path</li>
        </ul>
      </section>

      <section>
        <h2>Operational practices</h2>
        <ul>
          <li>Dependencies scanned in CI; critical patches applied within 72 hours</li>
          <li>Production access limited to authorized engineers with audit logging</li>
          <li>Database migrations tested against staging before production</li>
          <li>Backups: daily Postgres snapshots with tested restore procedures</li>
        </ul>
      </section>

      <section>
        <h2>Incident response</h2>
        <p>
          We maintain an incident response procedure covering detection,
          containment, notification, and post-mortem. Enterprise customers
          receive notification within 72 hours of confirmed data breaches
          affecting their organization data, per our DPA.
        </p>
        <p>
          Report security vulnerabilities to{" "}
          <a href="mailto:security@prabhixtechnologies.com">
            security@prabhixtechnologies.com
          </a>
          . We acknowledge reports within 2 business days.
        </p>
      </section>

      <section>
        <h2>Compliance</h2>
        <p>
          We support enterprise compliance requirements through our DPA, audit
          log exports, and security documentation. Formal SOC 2 certification is
          on our roadmap for Enterprise customers — contact sales for current
          status.
        </p>
      </section>
    </LegalLayout>
  );
}
