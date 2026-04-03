import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { hrefHome } from '@/utils/hrefs';

WebBrowser.maybeCompleteAuthSession();

type OAuthButtonProps = {
  strategy: 'oauth_google';
  children: ReactNode;
};

export function OAuthButton({ strategy, children }: OAuthButtonProps) {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onPress = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace(hrefHome);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, router, startSSOFlow, strategy]);

  return (
    <Pressable
      onPress={() => void onPress()}
      style={({ pressed }) => [styles.button, pressed && !loading && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}>
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color="#e2e8f0" size="small" />
        ) : (
          <Text style={styles.text}>{children}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
