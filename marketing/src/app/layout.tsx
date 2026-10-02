import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ChatWidgetLazy } from "@/components/chat/chat-widget-lazy";
import { ConsentBanner } from "@/components/consent-banner";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { VisitorTrackerProvider } from "@/components/visitor-tracker-provider";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/utils";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  // px-allow-literal: Next serialises these into <meta name="theme-color"> and the browser
  // paints the address bar from them before any stylesheet is consulted, so they cannot be
  // var(). This is --px-bg for the technologies light theme, which is the default. The boot
  // script and the theme toggle replace it when a saved choice is dark.
  themeColor: "#eef2f7",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    // Both, always: the class drives Tailwind's dark: variant, the attribute drives the
    // generated colour tokens. Setting one alone gives dark utilities on light colours.
    if (theme === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      var bar = document.querySelector('meta[name="theme-color"]');
      // px-allow-literal: theme-color meta, read before any stylesheet; --px-bg dark.
      if (bar) bar.setAttribute('content', '#0c1524');
    }
    var consent = localStorage.getItem('prabhix_cookie_consent');
    if (consent === 'accepted' || consent === 'declined') {
      window.prabhixConsent = consent;
    } else {
      window.prabhixConsent = 'pending';
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by src/proxy.ts. Reading it here is also what opts the tree into dynamic rendering,
  // which a nonce requires: a page prerendered at build time would carry a nonce from some earlier
  // request, and every script on it would be refused.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      // Selects the generated token theme in web-kit/packages/brand/tokens.json. The
      // marketing site is the parent brand, so it carries the house cyan + indigo pair.
      data-brand="technologies"
      data-theme="light"
      className={`${fraunces.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-[100dvh] flex-col overflow-x-hidden">
        <JsonLd data={organizationJsonLd()} />
        <SkipLink />
        <SiteHeader />
        <ConsentBanner />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Suspense fallback={null}>
          <VisitorTrackerProvider />
        </Suspense>
        <ChatWidgetLazy />
      </body>
    </html>
  );
}
