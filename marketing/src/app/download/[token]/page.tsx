import { issueDownload } from "@/lib/commerce/api";
import { isOpaqueToken } from "@/lib/commerce/shop-cookies";
import { redirect } from "next/navigation";

export const metadata = {
  referrer: "no-referrer" as const,
  robots: { index: false, follow: false },
  title: "Download",
};

/**
 * Email links land here. The token is consumed on the server and the browser is
 * sent to the short-lived storage URL. Client JS never sees the capability token.
 */
export default async function DownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isOpaqueToken(token)) {
    redirect("/shop?download=invalid");
  }
  try {
    const link = await issueDownload(token);
    redirect(link.downloadUrl);
  } catch {
    redirect("/shop?download=expired");
  }
}
