import { createOgImage } from "../opengraph-image";

export const runtime = "edge";
export const alt = "Prabhix Pricing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "Plans that scale with your organization",
    subtitle: "Starter · Growth · Business · Enterprise",
  });
}
