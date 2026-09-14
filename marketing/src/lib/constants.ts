import { appUrls, siteConfig } from "./site-config";

// Aliases over siteConfig, not a second declaration. These used to read the environment
// themselves, which let them drift from siteConfig for the same variable.
export const SITE_NAME = siteConfig.name;
export const SITE_TAGLINE = siteConfig.tagline;
export const SITE_URL = siteConfig.url;

export const PRABHIX_ACRONYM = [
  { letter: "P", word: "Progressive" },
  { letter: "R", word: "Research" },
  { letter: "A", word: "Automation" },
  { letter: "B", word: "Business" },
  { letter: "H", word: "Hub" },
  { letter: "I", word: "Innovation" },
  { letter: "X", word: "eXperience" },
] as const;

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/platform", label: "How we build" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
] as const;

export const PRODUCT_LINKS = [
  { href: "/products", label: "All products" },
  { href: "/products/oneops", label: "OneOps" },
  { href: "/products/mobistack", label: "MobiStack" },
  { href: "/products/helpdesk", label: "Helpdesk" },
  { href: "/products/mailroom", label: "Mailroom" },
] as const;

/** Public APK downloads — company store, not Admin. */
export const STORE_URL = appUrls.store;

/** Apps a visitor can sign into — never treat OneOps as the only company CTA. */
/** Apps a visitor can sign into. Each product starts OIDC; Identity is not a menu item. */
export const SIGN_IN_LINKS = [
  {
    href: `${appUrls.oneops}/login`,
    label: "OneOps",
    description: "Operator console",
  },
  {
    href: `${appUrls.mobistack}/login`,
    label: "MobiStack",
    description: "Repair shop app",
  },
  {
    href: `${appUrls.mailroom}/sign-in`,
    label: "Mailroom",
    description: "Personal mail",
  },
] as const;

export const RESOURCE_LINKS = [
  { href: "/docs", label: "Documentation" },
  { href: "/integrations", label: "Integrations" },
  { href: "/changelog", label: "Changelog" },
  { href: "/status", label: "Status" },
] as const;

export const API_BASE_URL = siteConfig.apiUrl;

/** @deprecated Prefer SIGN_IN_LINKS — OneOps is a product, not the company sign-in. */
export const CONSOLE_URL = siteConfig.consoleUrl;
