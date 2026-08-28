import { createOgImage } from "../opengraph-image";

export const runtime = "edge";
export const alt = "Prabhix Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "One codebase, enterprise-grade isolation",
    subtitle: "Multi-tenant workspaces · Shared inbox · Razorpay billing",
  });
}
