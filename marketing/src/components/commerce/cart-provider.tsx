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

  // The fetch, without the two lines that announce it is starting. Split out so the first load
  // can call it directly: `isLoading` already starts true and `error` already starts null, so
  // on mount those two were setting state to the value it was about to have anyway - a no-op
  // that still counted as a state update inside an effect.
  const load = useCallback(async () => {
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

  // What every caller outside this file gets: a reload that puts the cart back into its loading
  // state first, because by then the screen is showing the previous one.
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await load();
  }, [load]);

  // Awaited inside the effect rather than called from it. The two run identically - `load` is
  // async either way, so nothing in it happens before the first await - but only this shape can
  // be read as asynchronous by the compiler's set-state-in-effect rule, which stops at a call to
  // a function reference and assumes the worst. Writing it this way keeps the rule enforced over
  // the rest of the file instead of turning it off.
  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

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
