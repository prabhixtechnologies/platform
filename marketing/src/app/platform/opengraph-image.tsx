import { createOgImage } from "../opengraph-image";

export const runtime = "edge";
export const alt = "How Prabhix builds software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "How we build",
    subtitle: "Engineering practices · Shared identity · Product-shaped experiences",
  });
}
