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
        <Container className="flex h-12 items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Secure checkout · GST invoices · Ships across India
          </p>
          <CartButton />
        </Container>
      </div>
      {children}
    </CartProvider>
  );
}
