import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "lovely_wedding_favorites_v2";
const LEGACY_STORAGE_KEY = "lovely_wedding_favorites_v1";

const FavoritesContext = createContext(null);

/** Alias → id canonique (évite doublons Celestial/Sakura, Bridgeton, etc.) */
const ID_ALIASES = {
  bridgeton: "bridgerton",
  celestial: "sakura-koi",
  "sakura-koi": "sakura-koi",
};

function canonicalId(id) {
  if (!id || typeof id !== "string") return "";
  const key = id.trim().toLowerCase();
  return ID_ALIASES[key] || key;
}

function normalizeItem(entry) {
  if (!entry) return null;
  if (typeof entry === "string") {
    const id = canonicalId(entry);
    if (!id) return null;
    return {
      id,
      title: entry,
      to: "/invitations-digital",
      image: "",
      productType: "digital",
    };
  }
  if (typeof entry === "object" && typeof entry.id === "string" && entry.id) {
    const id = canonicalId(entry.id);
    if (!id) return null;
    return {
      id,
      title: entry.title || id,
      to: entry.to || "/invitations-digital",
      image: entry.image || "",
      productType: entry.productType === "print" ? "print" : "digital",
    };
  }
  return null;
}

function dedupeItems(list) {
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const item = normalizeItem(raw);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return dedupeItems(parsed);
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) return dedupeItems(parsed);
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
    const cid = canonicalId(id);
    if (!cid) return false;
    return items.some((item) => item.id === cid);
  };

  const toggleFavorite = (entry) => {
    const next = normalizeItem(typeof entry === "string" ? { id: entry } : entry);
    if (!next?.id) return;

    setItems((current) => {
      const exists = current.some((item) => item.id === next.id);
      if (exists) return current.filter((item) => item.id !== next.id);
      return dedupeItems([...current, next]);
    });
  };

  const removeFavorite = (id) => {
    const cid = canonicalId(id);
    if (!cid) return;
    setItems((current) => current.filter((item) => item.id !== cid));
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
