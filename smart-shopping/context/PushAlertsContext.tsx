import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@smart_shopping/push_alerts_enabled';

/** Keeps expo-notifications handler in sync without React re-renders. */
export const pushAlertsEnabledRef = { current: true };

type PushAlertsContextValue = {
  enabled: boolean;
  hydrated: boolean;
  setPushAlertsEnabled: (next: boolean) => Promise<void>;
};

const PushAlertsContext = createContext<PushAlertsContextValue | null>(null);

export function PushAlertsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          if (raw !== null) setEnabled(raw === 'true');
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) pushAlertsEnabledRef.current = enabled;
  }, [enabled, hydrated]);

  const setPushAlertsEnabled = useCallback(async (next: boolean) => {
    setEnabled(next);
    pushAlertsEnabledRef.current = next;
    await AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const value = useMemo(
    () => ({ enabled, hydrated, setPushAlertsEnabled }),
    [enabled, hydrated, setPushAlertsEnabled],
  );

  return <PushAlertsContext.Provider value={value}>{children}</PushAlertsContext.Provider>;
}

export function usePushAlerts() {
  const ctx = useContext(PushAlertsContext);
  if (!ctx) throw new Error('usePushAlerts must be used within PushAlertsProvider');
  return ctx;
}
