"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────

export interface CartItem {
  productId:   string;
  variantId?:  string;
  name:        string;
  image:       string;
  price:       number;
  size?:       string;
  color?:      string;
  quantity:    number;
  slug:        string;
}

interface CartContextValue {
  items:       CartItem[];
  count:       number;
  total:       number;
  addItem:     (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem:  (productId: string, variantId?: string) => void;
  updateQty:   (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart:   () => void;
  isInCart:    (productId: string, variantId?: string) => boolean;
}

// ── Context ───────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "store_cart";

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}_${variantId}` : productId;
}

// ── Provider ──────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage on change (بدون فتح السلة)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, mounted]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const key     = itemKey(newItem.productId, newItem.variantId);
        const exists  = prev.find(
          (i) => itemKey(i.productId, i.variantId) === key
        );
        if (exists) {
          return prev.map((i) =>
            itemKey(i.productId, i.variantId) === key
              ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      });
      window.dispatchEvent(new Event("cartItemAdded"));
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId?: string) => {
    const key = itemKey(productId, variantId);
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.variantId) !== key));
  }, []);

  const updateQty = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      const key = itemKey(productId, variantId);
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: string, variantId?: string) => {
      const key = itemKey(productId, variantId);
      return items.some((i) => itemKey(i.productId, i.variantId) === key);
    },
    [items]
  );

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, removeItem, updateQty, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
