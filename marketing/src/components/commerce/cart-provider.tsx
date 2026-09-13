"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { resolveVisitorId } from "@/lib/commerce/api";
import {
  clearVariantMeta,
  rememberVariant,
  readVariantMeta,
  cartHasPhysical,
  type VariantMeta,
} from "@/lib/commerce/cart-storage";
import { CommerceApiError, friendlyCommerceError } from "@/lib/commerce/errors";
import type { CartView, ProductType } from "@/lib/commerce/schemas";
import {
  migrateLegacySecrets,
  shopAddItem,
  shopApplyCode,
  shopClearCart,
  shopClearCode,
  shopGetCart,
  shopRemoveItem,
  shopUpdateItem,
} from "@/lib/commerce/shop-client";
import { allowsAnalytics } from "@/lib/visitor/consent";
import { readUiConsent } from "@/lib/visitor/consent";
import { trackEvent } from "@/lib/visitor/tracker";

type CartContextValue = {
  cart: CartView | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  hasPhysical: boolean;
  variantMeta: VariantMeta;
  refresh: () => Promise<void>;
  addItem: (
    variantId: string,
    quantity: number,
    meta: { productType: ProductType; slug: string; productName: string },
  ) => Promise<void>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCode: (code: string) => Promise<void>;
  removeCode: () => Promise<void>;
  clearError: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variantMeta, setVariantMeta] = useState<VariantMeta>({});

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await migrateLegacySecrets();
      const next = await shopGetCart();
      setCart(next);
      setVariantMeta(readVariantMeta());
    } catch (err) {
      if (err instanceof CommerceApiError && err.code === "CART_NOT_FOUND") {
        await shopClearCart().catch(() => undefined);
        clearVariantMeta();
        setCart(null);
      } else {
        setError(friendlyCommerceError(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const trackCommerce = useCallback(
    (name: string, properties?: Record<string, unknown>) => {
      if (!allowsAnalytics(readUiConsent())) return;
      trackEvent(name, properties);
    },
    [],
  );

  const addItem = useCallback(
    async (
      variantId: string,
      quantity: number,
      meta: { productType: ProductType; slug: string; productName: string },
    ) => {
      setError(null);
      try {
        const next = await shopAddItem(variantId, quantity, resolveVisitorId());
        rememberVariant(variantId, meta.productType, meta.slug);
        setVariantMeta(readVariantMeta());
        setCart(next);
        trackCommerce("commerce_add_to_cart", {
          variantId,
          slug: meta.slug,
          quantity,
        });
      } catch (err) {
        setError(friendlyCommerceError(err));
        throw err;
      }
    },
    [trackCommerce],
  );

  const setQuantity = useCallback(async (itemId: string, quantity: number) => {
    setError(null);
    try {
      const next =
        quantity < 1 ? await shopRemoveItem(itemId) : await shopUpdateItem(itemId, quantity);
      setCart(next);
    } catch (err) {
      if (err instanceof CommerceApiError && err.code === "CART_NOT_FOUND") {
        clearVariantMeta();
        setCart(null);
        return;
      }
      setError(friendlyCommerceError(err));
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setError(null);
    try {
      const next = await shopRemoveItem(itemId);
      setCart(next);
    } catch (err) {
      if (err instanceof CommerceApiError && err.code === "CART_NOT_FOUND") {
        clearVariantMeta();
        setCart(null);
        return;
      }
      setError(friendlyCommerceError(err));
      throw err;
    }
  }, []);

  const applyCode = useCallback(async (code: string) => {
    setError(null);
    try {
      const next = await shopApplyCode(code.trim());
      setCart(next);
    } catch (err) {
      setError(friendlyCommerceError(err));
      throw err;
    }
  }, []);

  const removeCode = useCallback(async () => {
    setError(null);
    try {
      const next = await shopClearCode();
      setCart(next);
    } catch (err) {
      setError(friendlyCommerceError(err));
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      error,
      itemCount: cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0,
      hasPhysical: cart
        ? cartHasPhysical(
            variantMeta,
            cart.items.map((i) => i.variantId),
          )
        : false,
      variantMeta,
      refresh,
      addItem,
      setQuantity,
      removeItem,
      applyCode,
      removeCode,
      clearError: () => setError(null),
    }),
    [
      cart,
      isLoading,
      error,
      variantMeta,
      refresh,
      addItem,
      setQuantity,
      removeItem,
      applyCode,
      removeCode,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
