import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { hrefHome } from '@/utils/hrefs';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
        }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  if (isSignedIn) return <Redirect href={hrefHome} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
        animation: 'fade',
      }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
