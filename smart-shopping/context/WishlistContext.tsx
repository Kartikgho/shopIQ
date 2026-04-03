import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@smartshopping_wishlist_v1';

type WishlistContextValue = {
  ids: Set<string>;
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const arr = JSON.parse(raw) as string[];
          setIds(new Set(Array.isArray(arr) ? arr : []));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: Set<string>) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    setIds(new Set(next));
  }, []);

  const toggle = useCallback(
    async (productId: string) => {
      const next = new Set(ids);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      await persist(next);
    },
    [ids, persist],
  );

  const isSaved = useCallback((productId: string) => ids.has(productId), [ids]);

  const value = useMemo(
    () => ({ ids, loading, toggle, isSaved }),
    [ids, loading, toggle, isSaved],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
