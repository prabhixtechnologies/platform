import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/utils";

export const runtime = "edge";
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
          background: "#0B0B12",
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
              background: "#7C3AED",
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
          <span style={{ fontSize: 28, fontWeight: 700, color: "#94A3B8" }}>
            {siteConfig.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#F8FAFC",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p style={{ fontSize: 26, color: "#94A3B8", marginTop: 24, maxWidth: 900 }}>
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
