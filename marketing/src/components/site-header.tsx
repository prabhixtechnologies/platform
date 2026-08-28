"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONSOLE_URL,
  NAV_LINKS,
  PRODUCT_LINKS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { LogoMark } from "./logo-mark";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./Button";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMobile();
    setProductsOpen(false);
  }, [pathname, closeMobile]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobile();
        menuButtonRef.current?.focus();
      }
    }

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        closeMobile();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    const panel = mobileNavRef.current;
    if (panel) {
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      focusables[0]?.focus();

      function trapFocus(e: KeyboardEvent) {
        if (e.key !== "Tab" || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      panel.addEventListener("keydown", trapFocus);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("touchstart", onPointerDown);
        panel.removeEventListener("keydown", trapFocus);
      };
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent",
      )}
    >
      <Container as="nav" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <LogoMark />

          <div className="hidden items-center gap-0.5 md:flex">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary lg:px-3",
                  pathname.startsWith("/products")
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                Products
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    productsOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {productsOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl"
                >
                  {PRODUCT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary lg:px-3",
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link
              href={CONSOLE_URL}
              title="Sign in to OneOps, the Prabhix operator console"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:inline-flex lg:px-3"
            >
              <LogIn className="size-4" aria-hidden />
              Sign in
            </Link>
            <Button href="/contact" size="sm" className="hidden sm:inline-flex">
              Contact
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen && (
        <div
          id="mobile-nav"
          ref={mobileNavRef}
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-background md:hidden"
          style={{ height: "calc(100dvh - 4rem - env(safe-area-inset-top, 0px))" }}
        >
          <Container className="py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex flex-col gap-1">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Products
              </p>
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href={CONSOLE_URL}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <LogIn className="size-4" aria-hidden />
                Sign in to OneOps
              </Link>
              <div className="flex items-center gap-3 px-3 py-2">
                <ThemeToggle />
                <Button href="/contact" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
