import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOrder } from "@/lib/commerce/api";
import { isOpaqueToken, ORDER_COOKIE, hostedCookieName, orderCookieOptions } from "@/lib/commerce/shop-cookies";

export const metadata = {
  referrer: "no-referrer" as const,
  robots: { index: false, follow: false },
  title: "Order",
};

/**
 * Email "view order" links land here. The access token is consumed on the
 * server into the httpOnly order cookie, then the browser is sent to the
 * confirmation page that never reads the token from JavaScript.
 */
export default async function ClaimOrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isOpaqueToken(token)) {
    redirect("/shop/order");
  }
  try {
    await getOrder(token);
  } catch {
    redirect("/shop/order");
  }
  const jar = await cookies();
  jar.set({ name: hostedCookieName(ORDER_COOKIE), value: token, ...orderCookieOptions() });
  redirect("/shop/order");
}
