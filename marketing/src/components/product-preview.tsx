import { cn } from "@/lib/utils";

/**
 * A product's real interface, drawn rather than photographed.
 *
 * <p>The homepage used to show a grey skeleton here — three empty bars and three empty tiles
 * over a gradient — on the public front door, next to copy claiming a finished product.
 *
 * <p>Drawn, not screenshotted, on purpose. A screenshot of a signed-in console leaks a real
 * shop's data, goes stale the week after it is taken, is illegible on a phone, and ships as a
 * 400 KB raster that has to be re-cut for dark mode. This is the same layout in markup: it
 * scales, it re-themes with the site, and it costs nothing to keep current.
 *
 * <p>Each variant carries its own product's accent pair, so the three previews on this page do
 * not read as one product screenshotted three times.
 */

type Tone = "mobistack" | "oneops" | "mailroom";

const TONE: Record<Tone, { accent: string; accent2: string; label: string }> = {
  // Set here rather than through data-brand: these previews sit on the marketing site, which
  // is the house theme, and each one needs its own product's hues at the same time.
  mobistack: { accent: "var(--px-ochre-600)", accent2: "var(--px-teal-600)", label: "MobiStack" },
  oneops: { accent: "var(--px-indigo-600)", accent2: "var(--px-fuchsia-600)", label: "OneOps" },
  mailroom: { accent: "var(--px-clay-600)", accent2: "var(--px-teal-600)", label: "Mailroom" },
};

function Frame({
  tone,
  title,
  children,
  className,
}: {
  tone: Tone;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { accent, accent2 } = TONE[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl",
        className,
      )}
      style={{ ["--p" as string]: accent, ["--p2" as string]: accent2 }}
      // The whole thing is decoration next to copy that already says what the product does.
      // Announcing forty nested divs to a screen reader would be noise, not information.
      role="img"
      aria-label={`${TONE[tone].label} interface preview`}
    >
      <div
        className="absolute inset-x-0 top-0 h-28 opacity-[0.16]"
        // `in oklab` for the same reason the brand tokens use it: interpolating two saturated
        // hues through sRGB desaturates the middle, and MobiStack's ochre-to-teal lands on
        // olive right where the eye sits.
        style={{ background: "linear-gradient(135deg in oklab, var(--p) 0%, 68%, var(--p2) 100%)" }}
      />

      <div className="relative flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
        <span className="size-2.5 rounded-full" style={{ background: "var(--p)" }} />
        <span className="size-2.5 rounded-full opacity-45" style={{ background: "var(--p2)" }} />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-2 truncate text-xs font-semibold text-text-muted">{title}</span>
      </div>

      <div className="relative p-4">{children}</div>
    </div>
  );
}

function Stat({ label, value, accent2 }: { label: string; value: string; accent2?: boolean }) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-elevated p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className="mt-1 text-lg font-bold tabular-nums"
        style={{ color: accent2 ? "var(--p2)" : "var(--p)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  title,
  meta,
  badge,
  badgeTone = "neutral",
}: {
  title: string;
  meta: string;
  badge?: string;
  badgeTone?: "neutral" | "ok" | "warn" | "accent";
}) {
  const tones = {
    // A ring as well as a fill: the neutral tint is close enough to the card behind it that
    // fill alone made the badge read as floating text.
    neutral: "bg-[var(--px-surface-sunken)] text-text-muted ring-1 ring-border",
    ok: "bg-[var(--px-success-subtle)] text-[var(--px-success-subtle-ink)]",
    warn: "bg-[var(--px-warning-subtle)] text-[var(--px-warning-subtle-ink)]",
    accent: "",
  } as const;

  return (
    <div className="flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{title}</p>
        <p className="truncate text-[11px] text-text-muted">{meta}</p>
      </div>
      {badge ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
            tones[badgeTone],
          )}
          style={
            badgeTone === "accent"
              ? { background: "color-mix(in oklab, var(--p) 14%, transparent)", color: "var(--p)" }
              : undefined
          }
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

/** The counter screen: what a repair shop actually looks at all day. */
export function MobiStackPreview({ className }: { className?: string }) {
  return (
    <Frame tone="mobistack" title="MobiStack · Sunrise Mobiles, Pune" className={className}>
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Today" value="₹48,210" />
        <Stat label="Repairs open" value="12" accent2 />
        <Stat label="Low stock" value="7" />
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-surface-elevated px-3">
        <Row title="iPhone 13 · screen replacement" meta="INV-2291 · Anjali K." badge="Ready" badgeTone="ok" />
        <Row title="Redmi Note 12 · battery" meta="INV-2290 · Waiting on part" badge="Blocked" badgeTone="warn" />
        <Row title="Samsung A54 · charging port" meta="INV-2288 · In progress" badge="Bench 2" badgeTone="accent" />
        <Row title="OnePlus 11 · diagnostics" meta="INV-2287 · Quoted" badge="Quote" badgeTone="neutral" />
      </div>

      <div
        className="mt-3 flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold"
        style={{
          background: "linear-gradient(135deg in oklab, var(--p) 0%, 68%, var(--p2) 100%)",
          // Both accents are 600-step, so their ink is the same in either theme. Taken from
          // the token rather than `text-white` so it stays right if a ramp is retuned.
          color: "var(--px-accent-ink)",
        }}
      >
        <span>Scan a code to sell</span>
        <span className="tabular-nums opacity-90">⌘K</span>
      </div>
    </Frame>
  );
}

/** The operator inbox: conversations, orders and the people handling them. */
export function OneOpsPreview({ className }: { className?: string }) {
  return (
    <Frame tone="oneops" title="OneOps · Inbox" className={className}>
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Unassigned" value="4" />
        <Stat label="First reply" value="2m 40s" accent2 />
        <Stat label="Resolved today" value="31" />
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-surface-elevated px-3">
        <Row title="Refund for order #4471" meta="Priya S. · WhatsApp · 3 min" badge="You" badgeTone="accent" />
        <Row title="Delivery delayed to Nashik" meta="Rahul M. · Email · 11 min" badge="SLA 2h" badgeTone="warn" />
        <Row title="Bulk quote — 40 units" meta="Anand T. · Chat · 26 min" badge="Sales" badgeTone="neutral" />
        <Row title="Warranty claim approved" meta="Fatima R. · Email · 1 h" badge="Closed" badgeTone="ok" />
      </div>
    </Frame>
  );
}

/** The mailbox: threads, the shared company inbox, and what is still a draft. */
export function MailroomPreview({ className }: { className?: string }) {
  return (
    <Frame tone="mailroom" title="Mailroom · support@" className={className}>
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Unread" value="18" />
        <Stat label="Shared" value="6" accent2 />
        <Stat label="Drafts" value="3" />
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-surface-elevated px-3">
        <Row title="Invoice for September" meta="accounts@vendor.in · 09:14" badge="Starred" badgeTone="accent" />
        <Row title="Re: onboarding the Nagpur branch" meta="ops@prabhix · 08:52" badge="3" badgeTone="neutral" />
        <Row title="Password reset confirmation" meta="no-reply@identity · 08:20" badge="Read" badgeTone="ok" />
        <Row title="Quarterly compliance checklist" meta="legal@prabhix · Yesterday" badge="Snoozed" badgeTone="warn" />
      </div>
    </Frame>
  );
}
