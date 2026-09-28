import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  /**
   * Scope everything inside this card to one product's palette.
   *
   * The colour utilities resolve through `[data-brand]`, so a card marked `oneops` takes
   * OneOps' indigo for its badge, links and buttons while the card beside it takes
   * MobiStack's amber. Without it a page showing three products draws all three in the
   * house teal, which is what "distinct experiences on top" is not.
   *
   * The names are the brands in tokens.json. Every one of them is contrast-asserted
   * against every surface, including surfaces belonging to a different brand, so
   * borrowing a palette here cannot produce an unreadable pairing.
   */
  brand?: "technologies" | "oneops" | "admin" | "mobistack" | "mailroom";
};

export function Card({ children, className, hover = false, brand }: CardProps) {
  return (
    <div
      data-brand={brand}
      className={cn(
        "glass rounded-2xl p-6 sm:p-8",
        hover &&
          "transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
