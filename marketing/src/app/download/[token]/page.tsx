import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isOpaqueToken, DOWNLOAD_COOKIE, downloadCookieOptions, hostedCookieName } from "@/lib/commerce/shop-cookies";

export const metadata = {
  referrer: "no-referrer" as const,
  robots: { index: false, follow: false },
  title: "Download",
};

/**
 * Email links land here. The token is parked in an httpOnly cookie and the
 * browser is sent to /download with no capability in the URL. Client JS never
 * sees the token. The first GET still appears in logs — that is inherent to a
 * clickable email link.
 */
export default async function DownloadTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isOpaqueToken(token)) {
    redirect("/shop?download=invalid");
  }
  const jar = await cookies();
  jar.set({
    name: hostedCookieName(DOWNLOAD_COOKIE),
    value: token,
    ...downloadCookieOptions(),
  });
  redirect("/download");
}
