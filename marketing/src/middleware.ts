import { NextResponse, type NextRequest } from "next/server";

/**
 * Issues a per-request nonce and the site's Content-Security-Policy.
 *
 * The policy used to come from deploy/Caddyfile, shared with the console, and it carried
 * `script-src 'unsafe-inline'` because Next's streaming payload arrives as inline `<script>` tags
 * that nothing can predict the contents of. With `'unsafe-inline'` present, script-src permits any
 * injected script and the policy stops almost nothing — so the shared string was as weak as its
 * weakest tenant, and the console inherited that weakness. Each app now sets its own.
 *
 * A nonce is the only mechanism Next's inline payload can use, and it has a cost worth stating: the
 * value differs per request, so pages cannot be prerendered at build time. Reading `headers()` in
 * the root layout is what makes that switch explicit rather than accidental — without it, a
 * prerendered page would ship scripts carrying no nonce at all and the browser would block them,
 * which looks like the site being broken rather than like a caching decision. Every response is
 * rendered by the Node process either way here, since nothing sits in front of it caching HTML, so
 * the loss is a render per request rather than a round trip to an origin.
 */

const isProduction = process.env.NODE_ENV === "production";

function buildPolicyParts(nonce: string): string[] {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    // Lets a script we already trust load another — which is how Razorpay's checkout.js gets on the
    // page, injected by client code rather than written into the markup. Browsers that understand it
    // ignore the host list below; the host list stays for those that do not.
    "'strict-dynamic'",
    "https://checkout.razorpay.com",
    // Next's dev server compiles with eval. Excluded from production, where nothing needs it.
    ...(isProduction ? [] : ["'unsafe-eval'"]),
  ].join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Inline styles stay permitted: next/font emits a <style> block, and Radix and the animation
    // helpers set style attributes, which a nonce cannot cover. The exposure is appearance rather
    // than code execution.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    // Shop, chat, and visitor beacons are same-origin BFFs (and /api/backend rewrite). Razorpay
    // still talks to its own API from the checkout iframe's parent.
    "connect-src 'self' https://api.razorpay.com",
    "frame-src https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
}

export function middleware(request: NextRequest) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const path = request.nextUrl.pathname;
  const checkout = path.startsWith("/shop/checkout");
  const capabilityLanding =
    path.startsWith("/download/") || path.startsWith("/shop/order/claim/");
  const policy = [
    ...buildPolicyParts(nonce),
    checkout ? "frame-ancestors 'none'" : "frame-ancestors 'self'",
  ].join("; ");

  // Next reads the nonce back out of the policy on the *request* headers and stamps it onto the
  // script tags it generates. Setting it only on the response would leave those tags unnonced and
  // therefore blocked by the very header we just sent.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", policy);
  // Capability URLs live in the path. The HTML meta is no-referrer too, but redirects never
  // render that document — the header on this response is what the next hop sees.
  response.headers.set(
    "referrer-policy",
    capabilityLanding ? "no-referrer" : "strict-origin-when-cross-origin",
  );
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if (isProduction) {
    response.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

export const config = {
  matcher: [
    // Documents only. Static output and files served straight from public/ carry no scripts to
    // nonce, and running this for each of them would spend work on every asset request.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
