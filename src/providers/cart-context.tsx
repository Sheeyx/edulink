"use client";

import * as React from "react";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  price: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "cart";

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore (e.g. storage disabled)
    }
  }, [items, ready]);

  const addItem = React.useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = React.useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const isInCart = React.useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const clear = React.useCallback(() => setItems([]), []);

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + (i.price || 0), 0),
      ready,
      addItem,
      removeItem,
      toggleItem,
      isInCart,
      clear,
    }),
    [items, ready, addItem, removeItem, toggleItem, isInCart, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
