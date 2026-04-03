import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AppProviders } from '@/context/AppProviders';
import { usePushSetup } from '@/hooks/usePushSetup';

export { ErrorBoundary } from 'expo-router';

function PushBootstrap() {
  usePushSetup();
  return null;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment');
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoading>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
          }}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </ClerkLoading>
      <ClerkLoaded>
        <AppProviders>
          <PushBootstrap />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F9FAFB' },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="compare/[id]" />
            <Stack.Screen
              name="login"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="signup"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AppProviders>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
