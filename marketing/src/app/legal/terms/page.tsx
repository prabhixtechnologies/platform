import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of Prabhix Technologies platform and services.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 27, 2025">
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern access to and use of
          services provided by Prabhix Technologies (&quot;Prabhix&quot;),
          including the OneOps console at oneops.prabhixtechnologies.com,
          products such as MobiStack, and the marketing website. By creating an
          account or using our services, you agree to these Terms.
        </p>
      </section>

      <section>
        <h2>2. Services</h2>
        <p>
          Prabhix provides cloud-based software services on a subscription
          basis. Features and availability depend on your plan. We may modify
          features with reasonable notice. Beta features are provided &quot;as
          is&quot; without SLA commitments.
        </p>
      </section>

      <section>
        <h2>3. Accounts and organizations</h2>
        <ul>
          <li>
            You must provide accurate registration information and keep
            credentials secure.
          </li>
          <li>
            Organization owners and admins are responsible for member access,
            role assignments, and activity within their workspace.
          </li>
          <li>
            You must be at least 18 years old and authorized to bind your
            organization to these Terms.
          </li>
          <li>
            One person may not maintain more than one free-tier account for the
            same organization without our consent.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate applicable laws or third-party rights</li>
          <li>Upload malware, spam, or unlawful content</li>
          <li>Attempt unauthorized access to systems or other tenants&apos; data</li>
          <li>Reverse engineer, scrape, or overload our infrastructure</li>
          <li>Use the service to send unsolicited bulk email without consent</li>
          <li>Resell or sublicense the service without a written agreement</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules, with
          notice where practicable.
        </p>
      </section>

      <section>
        <h2>5. Fees and payment</h2>
        <p>
          Paid plans are billed in INR through Razorpay. Fees are non-refundable
          except as required by law or stated in your plan. We may change pricing
          with 30 days&apos; notice; changes apply at your next renewal. Failure
          to pay may result in service suspension after a grace period.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          Prabhix retains all rights to the platform, software, documentation,
          and branding. You retain ownership of data you upload (&quot;Customer
          Data&quot;). You grant Prabhix a limited license to process Customer
          Data solely to provide the services, as described in our Privacy Policy
          and DPA.
        </p>
      </section>

      <section>
        <h2>7. Confidentiality and data</h2>
        <p>
          Each party will protect the other&apos;s confidential information.
          Enterprise customers may execute our Data Processing Agreement for
          additional data protection commitments. See our Security page for
          technical controls.
        </p>
      </section>

      <section>
        <h2>8. Warranties and disclaimers</h2>
        <p>
          Services are provided &quot;as is&quot; except as expressly stated in
          an Enterprise SLA. We do not warrant uninterrupted or error-free
          operation. We disclaim implied warranties of merchantability and fitness
          for a particular purpose to the maximum extent permitted by law.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Prabhix&apos;s total liability
          for any claim arising from these Terms is limited to fees paid by you
          in the 12 months preceding the claim. We are not liable for indirect,
          incidental, special, or consequential damages, including lost profits
          or data.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          You may cancel at any time through account settings. We may terminate
          for material breach with 15 days&apos; notice to cure. Upon
          termination, you may export your data within 30 days; thereafter we
          may delete it per our retention policy.
        </p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>
          These Terms are governed by the laws of India. Disputes shall be
          subject to the exclusive jurisdiction of courts in Bengaluru,
          Karnataka. Contact:{" "}
          <a href="mailto:legal@prabhixtechnologies.com">
            legal@prabhixtechnologies.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
