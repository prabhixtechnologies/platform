import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description:
    "Data Processing Agreement for Prabhix Technologies enterprise customers.",
};

export default function DpaPage() {
  return (
    <LegalLayout title="Data Processing Agreement" lastUpdated="August 27, 2025">
      <section>
        <h2>1. Scope</h2>
        <p>
          This Data Processing Agreement (&quot;DPA&quot;) forms part of the
          agreement between Prabhix Technologies (&quot;Processor&quot;) and the
          customer entity (&quot;Controller&quot;) using Prabhix platform
          services. It governs Processor&apos;s handling of Personal Data on
          Controller&apos;s behalf under applicable data protection law, including
          the Digital Personal Data Protection Act, 2023 (India).
        </p>
      </section>

      <section>
        <h2>2. Definitions</h2>
        <ul>
          <li>
            <strong>Personal Data:</strong> any information relating to an
            identified or identifiable individual processed through the services.
          </li>
          <li>
            <strong>Processing:</strong> any operation performed on Personal Data,
            including collection, storage, use, disclosure, and deletion.
          </li>
          <li>
            <strong>Sub-processor:</strong> a third party engaged by Processor to
            process Personal Data.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Roles and instructions</h2>
        <p>
          Controller determines the purposes and means of processing Personal
          Data of its employees, customers, and contacts. Processor processes
          Personal Data only on documented instructions from Controller — including
          configuration of the services, support requests, and compliance with
          applicable law.
        </p>
      </section>

      <section>
        <h2>4. Processor obligations</h2>
        <p>Processor shall:</p>
        <ul>
          <li>
            Process Personal Data only as instructed and for the purposes of
            providing the services
          </li>
          <li>
            Ensure personnel with access to Personal Data are bound by
            confidentiality obligations
          </li>
          <li>
            Implement appropriate technical and organizational measures as
            described in our Security documentation
          </li>
          <li>
            Assist Controller with data subject requests within reasonable timeframes
          </li>
          <li>
            Notify Controller without undue delay (within 72 hours) upon becoming
            aware of a Personal Data breach
          </li>
          <li>
            Delete or return Personal Data upon termination, subject to legal
            retention requirements
          </li>
          <li>
            Make available information necessary to demonstrate compliance and
            allow audits upon reasonable notice (max once per year)
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Sub-processors</h2>
        <p>
          Controller authorizes Processor to engage sub-processors listed below.
          Processor will notify Controller of new sub-processors with 30 days&apos;
          notice; Controller may object on reasonable grounds.
        </p>
        <table className="block md:table">
          <thead className="hidden md:table-header-group">
            <tr>
              <th>Sub-processor</th>
              <th>Purpose</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            <tr className="mb-4 block rounded-lg border border-border p-4 md:mb-0 md:table-row md:border-0 md:p-0">
              <td className="block pb-1 font-semibold text-foreground md:table-cell md:font-normal md:text-muted-foreground" data-label="Sub-processor">
                Amazon Web Services
              </td>
              <td className="block pb-1 text-sm before:font-semibold before:text-foreground before:content-['Purpose:_'] md:table-cell md:text-base md:before:content-none">
                Cloud hosting, S3 storage
              </td>
              <td className="block text-sm before:font-semibold before:text-foreground before:content-['Location:_'] md:table-cell md:text-base md:before:content-none">
                India (ap-south-1)
              </td>
            </tr>
            <tr className="mb-4 block rounded-lg border border-border p-4 md:mb-0 md:table-row md:border-0 md:p-0">
              <td className="block pb-1 font-semibold text-foreground md:table-cell md:font-normal md:text-muted-foreground">
                Razorpay Software Pvt. Ltd.
              </td>
              <td className="block pb-1 text-sm before:font-semibold before:text-foreground before:content-['Purpose:_'] md:table-cell md:text-base md:before:content-none">
                Payment processing
              </td>
              <td className="block text-sm before:font-semibold before:text-foreground before:content-['Location:_'] md:table-cell md:text-base md:before:content-none">
                India
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>6. International transfers</h2>
        <p>
          Personal Data is primarily processed in India. If transfer outside India
          is required, Processor will ensure appropriate safeguards consistent
          with applicable law, including standard contractual clauses or equivalent
          mechanisms approved by relevant authorities.
        </p>
      </section>

      <section>
        <h2>7. Data subject rights</h2>
        <p>
          Processor will assist Controller in fulfilling data subject requests
          (access, correction, deletion, portability) by providing tools within
          the platform and responding to Controller-initiated requests within 15
          business days.
        </p>
      </section>

      <section>
        <h2>8. Liability</h2>
        <p>
          Each party&apos;s liability under this DPA is subject to the limitation
          of liability provisions in the main service agreement. Nothing in this
          DPA limits either party&apos;s liability for breaches of data protection
          law where such limitation is prohibited.
        </p>
      </section>

      <section>
        <h2>9. Term and termination</h2>
        <p>
          This DPA remains in effect for the duration of the service agreement.
          Upon termination, Processor will delete Controller&apos;s Personal Data
          within 90 days unless retention is required by law. Controller may
          export data during a 30-day post-termination window.
        </p>
      </section>

      <section>
        <h2>10. Execution</h2>
        <p>
          This DPA is incorporated by reference into the Terms of Service for
          Business and Enterprise plans. Enterprise customers may request a
          countersigned copy by contacting{" "}
          <a href="mailto:legal@prabhixtechnologies.com">
            legal@prabhixtechnologies.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
