"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// The theme already lives on <html>, put there by the inline script in the layout before
// anything paints. Reading it back from there rather than working it out from localStorage a
// second time means the button cannot disagree with the page it sits on, and it keeps up when
// something else changes the theme, including the same choice in another tab.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

const read = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

// There is no <html> to read while rendering on the server, and no honest answer either: the
// choice is in a browser store. Undefined renders the disabled button below, which is what the
// old `mounted` flag did - the difference is that it is no longer a state update in an effect.
const readOnServer = () => undefined;

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, readOnServer);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    // Both, always: the class drives Tailwind's dark: variant, the attribute drives the
    // generated colour tokens. Setting one alone gives dark utilities on light colours.
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.dataset.theme = next;
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute("content", next === "dark" ? "#0c1524" : "#eef2f7");
  }

  if (!theme) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground",
          className,
        )}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="size-5" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30",
        className,
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </button>
  );
}
