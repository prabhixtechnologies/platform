import { headers } from "next/headers";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Structured data for crawlers.
 *
 * The nonce is read here rather than passed in by each of the seven call sites. Browsers do not
 * execute a script whose type is not JavaScript, so this block is not the code-execution risk that
 * script-src exists to control — but it is still a `<script>` element, and having it carry the
 * nonce means no reading of the spec is required to be confident that a stricter policy later will
 * not quietly cost the site its rich results.
 */
export async function JsonLd({ data }: JsonLdProps) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
