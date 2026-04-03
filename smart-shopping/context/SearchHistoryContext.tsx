import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@smartshopping_recent_searches_v1';
const MAX_ITEMS = 12;

type SearchHistoryContextValue = {
  items: string[];
  loading: boolean;
  add: (query: string) => Promise<void>;
  clear: () => Promise<void>;
};

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const arr = JSON.parse(raw) as string[];
          setItems(Array.isArray(arr) ? arr : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const add = useCallback(async (query: string) => {
    const q = query.trim();
    if (q.length < 2) return;
    const next = [q, ...items.filter((i) => i.toLowerCase() !== q.toLowerCase())].slice(0, MAX_ITEMS);
    setItems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [items]);

  const clear = useCallback(async () => {
    setItems([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ items, loading, add, clear }), [items, loading, add, clear]);

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

export function useSearchHistory(): SearchHistoryContextValue {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx) throw new Error('useSearchHistory must be used within SearchHistoryProvider');
  return ctx;
}
