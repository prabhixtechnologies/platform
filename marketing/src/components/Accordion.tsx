"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-border rounded-2xl border border-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="glass rounded-none first:rounded-t-2xl last:rounded-b-2xl">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-foreground transition-colors hover:text-primary"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`heading-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={`panel-${item.id}`}
              role="region"
              aria-labelledby={`heading-${item.id}`}
              hidden={!isOpen}
              className="px-6 pb-5 text-muted-foreground"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
