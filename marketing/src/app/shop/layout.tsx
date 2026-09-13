import { CartProvider } from "@/components/commerce/cart-provider";
import { CartButton } from "@/components/commerce/cart-drawer";
import { Container } from "@/components/Container";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="border-b border-border bg-surface/30">
        <Container className="flex flex-col gap-2 py-3 text-sm sm:h-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <p className="min-w-0 truncate text-muted-foreground">
            Secure checkout · GST invoices · Ships across India
          </p>
          <CartButton />
        </Container>
      </div>
      {children}
    </CartProvider>
  );
}
