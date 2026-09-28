import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/utils";

export const runtime = "nodejs";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgImageProps = {
  title: string;
  subtitle?: string;
};

export function createOgImage({ title, subtitle }: OgImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          // px-allow-literal: every colour in this file is rasterised to a PNG by Satori on
          // the server, where there is no document and no stylesheet, so none of them can be
          // var(). They are the technologies theme's dark values: --px-bg here, --px-accent on
          // the mark below, --px-ink-inverse and --px-ink-muted on the text.
          background: "#0c1524",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              // px-allow-literal: see the file note above.
              background: "#0e7490",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            P
          </div>
          {/* px-allow-literal: see the file note above. */}
          <span style={{ fontSize: 28, fontWeight: 700, color: "#94a3b8" }}>
            {siteConfig.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 52,
            fontWeight: 700,
            // px-allow-literal: see the file note above.
            color: "#f8fafc",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: 26,
              // px-allow-literal: see the file note above.
              color: "#94a3b8",
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    ),
    { ...size },
  );
}

export default function OpenGraphImage() {
  return createOgImage({
    title: siteConfig.tagline,
    subtitle: "Enterprise SaaS · Multi-tenant platform · MobiStack",
  });
}
