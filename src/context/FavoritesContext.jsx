import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "lovely_wedding_favorites_v2";
const LEGACY_STORAGE_KEY = "lovely_wedding_favorites_v1";

const FavoritesContext = createContext(null);

function normalizeItem(entry) {
  if (!entry) return null;
  if (typeof entry === "string") {
    return {
      id: entry,
      title: entry,
      to: "/invitations-digital",
      image: "",
      productType: "digital",
    };
  }
  if (typeof entry === "object" && typeof entry.id === "string" && entry.id) {
    return {
      id: entry.id,
      title: entry.title || entry.id,
      to: entry.to || "/invitations-digital",
      image: entry.image || "",
      productType: entry.productType === "print" ? "print" : "digital",
    };
  }
  return null;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeItem).filter(Boolean);
      }
    }
    // Migrate v1 (string ids only)
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeItem).filter(Boolean);
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(() => loadFavorites());

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isFavorite = (id) => {
    if (!id) return false;
    return items.some((item) => item.id === id);
  };

  const toggleFavorite = (entry) => {
    const next = normalizeItem(typeof entry === "string" ? { id: entry } : entry);
    if (!next?.id) return;

    setItems((current) => {
      const exists = current.some((item) => item.id === next.id);
      if (exists) return current.filter((item) => item.id !== next.id);
      return [...current, next];
    });
  };

  const removeFavorite = (id) => {
    if (!id) return;
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      items,
      ids: items.map((item) => item.id),
      isFavorite,
      toggleFavorite,
      removeFavorite,
      count: items.length,
    }),
    [items]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider.");
  }
  return context;
}
