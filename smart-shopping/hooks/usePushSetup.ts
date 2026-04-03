import * as Notifications from 'expo-notifications';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { pushAlertsEnabledRef, usePushAlerts } from '@/context/PushAlertsContext';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const on = pushAlertsEnabledRef.current;
    return {
      shouldShowBanner: on,
      shouldShowList: on,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

/**
 * Requests permission and ensures Android channel. When a user is signed in,
 * registers for push token (Expo) — wire FCM/APNs server in production.
 */
export function usePushSetup() {
  const { isSignedIn } = useAuth();
  const { enabled, hydrated } = usePushAlerts();
  const ran = useRef(false);

  useEffect(() => {
    if (!enabled) ran.current = false;
  }, [enabled]);

  useEffect(() => {
    if (!isSignedIn || !hydrated || !enabled || ran.current) return;
    ran.current = true;

    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('deals', {
          name: 'Deals & price alerts',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;
      try {
        await Notifications.getExpoPushTokenAsync();
      } catch {
        /* Simulator or missing EAS projectId — configure for production FCM/APNs */
      }
    })();
  }, [isSignedIn, hydrated, enabled]);
}
