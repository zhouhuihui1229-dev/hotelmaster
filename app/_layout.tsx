import { Stack } from "expo-router";
import React, { createContext, useContext, useMemo, useState } from "react";

type FavoritesCtx = {
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesCtx | null>(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isFavorite = (id: string) => !!favorites[id];

  const value = useMemo(() => ({ favorites, toggleFavorite, isFavorite }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack />
    </FavoritesProvider>
  );
}
