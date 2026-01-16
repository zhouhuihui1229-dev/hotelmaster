import { Stack } from "expo-router";
import React, { createContext, useContext, useMemo, useState } from "react";

type Ctx = {
  favorites: Record<string, boolean>;
  toggle: (id: string) => void;
  isFav: (id: string) => boolean;
};

const FavCtx = createContext<Ctx | null>(null);

export function useFavorites() {
  const c = useContext(FavCtx);
  if (!c) throw new Error("useFavorites outside provider");
  return c;
}

export default function RootLayout() {
  const [favorites, setFav] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setFav(p => ({ ...p, [id]: !p[id] }));
  const isFav = (id: string) => !!favorites[id];
  const value = useMemo(() => ({ favorites, toggle, isFav }), [favorites]);

  return (
    <FavCtx.Provider value={value}>
      <Stack screenOptions={{ headerShown: false }} />
    </FavCtx.Provider>
  );
}

