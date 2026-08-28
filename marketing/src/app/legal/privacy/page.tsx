import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Prabhix Technologies collects, uses, and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 27, 2025">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Prabhix Technologies (&quot;Prabhix&quot;, &quot;we&quot;, &quot;us&quot;) operates
          prabhixtechnologies.com, oneops.prabhixtechnologies.com, and related
          products including MobiStack. This Privacy Policy explains how we
          collect, use, disclose, and safeguard personal information when you
          visit our websites, use our services, or interact with us.
        </p>
        <p>
          We process personal data in accordance with applicable Indian law,
          including the Digital Personal Data Protection Act, 2023 (DPDPA), and
          where applicable, contractual obligations under our Data Processing
          Agreement with enterprise customers.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <h3>Information you provide</h3>
        <ul>
          <li>
            <strong>Account data:</strong> name, email address, phone number,
            organization name, and role when you register or are invited to a
            workspace.
          </li>
          <li>
            <strong>Contact and lead data:</strong> information submitted through
            contact forms, demo requests, newsletter subscriptions, and job
            applications.
          </li>
          <li>
            <strong>Payment data:</strong> billing name, address, and GSTIN.
            Payment card details are collected and processed directly by
            Razorpay — we do not store full card numbers.
          </li>
          <li>
            <strong>Communications:</strong> content of emails and messages sent
            through our shared inbox and helpdesk features.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Usage data:</strong> pages visited, features used, timestamps,
            and referring URLs on our marketing site and customer application.
          </li>
          <li>
            <strong>Device and log data:</strong> IP address, browser type,
            operating system, and device identifiers in server logs.
          </li>
          <li>
            <strong>Cookies:</strong> session cookies for authentication and
            preference cookies for theme settings. See Section 7.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use personal data to:</p>
        <ul>
          <li>Provide, operate, and maintain the Prabhix platform and products</li>
          <li>Process transactions and manage subscriptions via Razorpay</li>
          <li>Respond to inquiries, demo requests, and support tickets</li>
          <li>Send product updates and marketing communications (with consent)</li>
          <li>Improve our services through aggregated analytics</li>
          <li>Detect, prevent, and address fraud, abuse, and security incidents</li>
          <li>Comply with legal obligations and enforce our Terms of Service</li>
        </ul>
      </section>

      <section>
        <h2>4. Legal bases for processing</h2>
        <p>Depending on context, we process data based on:</p>
        <ul>
          <li>Performance of a contract (providing services you signed up for)</li>
          <li>Legitimate interests (security, product improvement, fraud prevention)</li>
          <li>Consent (marketing emails, optional cookies)</li>
          <li>Legal obligation (tax records, regulatory requests)</li>
        </ul>
      </section>

      <section>
        <h2>5. Data sharing</h2>
        <p>We do not sell personal data. We share data with:</p>
        <ul>
          <li>
            <strong>Service providers:</strong> cloud hosting (AWS), payment
            processing (Razorpay), email delivery, and analytics — bound by
            data processing agreements.
          </li>
          <li>
            <strong>Enterprise customers:</strong> when you use our platform as
            an employee or agent of a customer organization, your organization
            admin controls access to workspace data.
          </li>
          <li>
            <strong>Legal requirements:</strong> when required by law, court
            order, or to protect rights and safety.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Data retention</h2>
        <p>
          We retain account data for the duration of your subscription plus a
          reasonable period for backup and legal compliance. Marketing lead data
          is retained for 24 months unless you request deletion. Audit logs are
          retained for 90 days in active storage, then archived. Job application
          data is retained for 12 months.
        </p>
      </section>

      <section>
        <h2>7. Cookies</h2>
        <p>
          Our marketing site uses essential cookies for theme preference
          (localStorage) and session management. The customer application uses
          authentication cookies. We do not use third-party advertising cookies.
          You can control cookies through your browser settings.
        </p>
      </section>

      <section>
        <h2>8. Your rights</h2>
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Lodge a complaint with the relevant data protection authority</li>
        </ul>
        <p>
          To exercise these rights, contact{" "}
          <a href="mailto:privacy@prabhixtechnologies.com">
            privacy@prabhixtechnologies.com
          </a>
          . Enterprise users should also contact their organization administrator.
        </p>
      </section>

      <section>
        <h2>9. International transfers</h2>
        <p>
          Our primary infrastructure is hosted in AWS regions within India.
          Where data is transferred internationally, we ensure appropriate
          safeguards through standard contractual clauses or equivalent mechanisms.
        </p>
      </section>

      <section>
        <h2>10. Changes and contact</h2>
        <p>
          We may update this policy periodically. Material changes will be
          communicated via email or in-app notice. Questions:{" "}
          <a href="mailto:privacy@prabhixtechnologies.com">
            privacy@prabhixtechnologies.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
