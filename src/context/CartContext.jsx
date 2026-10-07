import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "lovely_wedding_cart_v1";

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeLineId(item) {
  return [
    item.productType,
    item.productId,
    item.format || "",
    item.motif || "",
  ].join("|");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const lineId = item.lineId || makeLineId(item);
    const qty = Math.max(1, Number(item.qty) || 1);
    const unitPrice = Number(item.unitPrice) || 0;

    setItems((current) => {
      const existing = current.find((entry) => entry.lineId === lineId);
      if (existing) {
        return current.map((entry) =>
          entry.lineId === lineId
            ? { ...entry, qty: entry.qty + qty }
            : entry
        );
      }

      return [
        ...current,
        {
          lineId,
          productType: item.productType,
          productId: item.productId,
          title: item.title,
          qty,
          unitPrice,
          format: item.format || "",
          motif: item.motif || "",
          meta: item.meta || {},
        },
      ];
    });
  };

  const updateQty = (lineId, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    setItems((current) =>
      current.map((entry) =>
        entry.lineId === lineId ? { ...entry, qty: nextQty } : entry
      )
    );
  };

  const removeItem = (lineId) => {
    setItems((current) => current.filter((entry) => entry.lineId !== lineId));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
