import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem { product: Product; qty: number }

interface CartCtx {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const noop = () => {};
const fallback: CartCtx = {
  items: [], add: noop, remove: noop, setQty: noop, clear: noop,
  count: 0, subtotal: 0, wishlist: [], toggleWishlist: noop,
};

const Ctx = createContext<CartCtx>(fallback);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("vr_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("vr_wish") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("vr_cart", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("vr_wish", JSON.stringify(wishlist)); }, [wishlist]);

  const add = (p: Product, qty = 1) => setItems(prev => {
    const i = prev.findIndex(x => x.product.id === p.id);
    if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + qty }; return next; }
    return [...prev, { product: p, qty }];
  });
  const remove = (id: string) => setItems(prev => prev.filter(x => x.product.id !== id));
  const setQty = (id: string, qty: number) => setItems(prev => prev.map(x => x.product.id === id ? { ...x, qty: Math.max(1, qty) } : x));
  const clear = () => setItems([]);
  const toggleWishlist = (id: string) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const value = useMemo<CartCtx>(() => ({
    items, add, remove, setQty, clear,
    count: items.reduce((s, x) => s + x.qty, 0),
    subtotal: items.reduce((s, x) => s + x.qty * x.product.price, 0),
    wishlist, toggleWishlist,
  }), [items, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// Safe hook — returns a no-op cart when no provider is mounted,
// so every route renders even outside <CartProvider>.
export const useCart = () => useContext(Ctx);