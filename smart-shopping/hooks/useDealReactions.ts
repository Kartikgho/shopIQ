import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { DealReaction } from '@/types';

const KEY = '@smartshopping_deal_reactions_v1';

type MapType = Record<string, DealReaction>;

export function useDealReactions() {
  const [map, setMap] = useState<MapType>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as MapType;
          setMap(typeof parsed === 'object' && parsed ? parsed : {});
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setReaction = useCallback((dealId: string, reaction: DealReaction | null) => {
    setMap((prev) => {
      const next = { ...prev };
      if (reaction === null) delete next[dealId];
      else next[dealId] = reaction;
      void AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getReaction = useCallback((dealId: string) => map[dealId] ?? null, [map]);

  return { map, ready, setReaction, getReaction };
}
