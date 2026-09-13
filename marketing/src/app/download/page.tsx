import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { issueDownload } from "@/lib/commerce/api";
import {
  DOWNLOAD_COOKIE,
  downloadCookieOptions,
  hostedCookieName,
  isOpaqueToken,
  readHostCookie,
} from "@/lib/commerce/shop-cookies";

export const metadata = {
  referrer: "no-referrer" as const,
  robots: { index: false, follow: false },
  title: "Download",
};

export default async function DownloadPage() {
  const jar = await cookies();
  const token = readHostCookie(jar, DOWNLOAD_COOKIE);
  jar.set({
    name: hostedCookieName(DOWNLOAD_COOKIE),
    value: "",
    ...downloadCookieOptions(),
    maxAge: 0,
  });
  if (!isOpaqueToken(token)) {
    redirect("/shop?download=invalid");
  }
  let link: { downloadUrl: string };
  try {
    link = await issueDownload(token);
  } catch {
    redirect("/shop?download=expired");
  }
  redirect(link.downloadUrl);
}
