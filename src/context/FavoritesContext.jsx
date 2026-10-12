import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "lovely_wedding_favorites_v1";

const FavoritesContext = createContext(null);

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => loadFavorites());

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const isFavorite = (id) => ids.includes(id);

  const toggleFavorite = (id) => {
    if (!id) return;
    setIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  };

  const value = useMemo(
    () => ({
      ids,
      isFavorite,
      toggleFavorite,
      count: ids.length,
    }),
    [ids]
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
