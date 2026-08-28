import { createOgImage } from "../opengraph-image";

export const runtime = "edge";
export const alt = "About Prabhix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage({
    title: "Software that respects how business works",
    subtitle: "Progressive Research & Automation Business Hub for Innovation & eXperience",
  });
}
