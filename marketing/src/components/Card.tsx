import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
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
