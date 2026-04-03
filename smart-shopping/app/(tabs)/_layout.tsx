import { Redirect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { theme } from '@/constants/theme';
import { hrefSignIn } from '@/utils/hrefs';

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primaryMid} />
      </View>
    );
  }
  if (!isSignedIn) return <Redirect href={hrefSignIn} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryMid,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
          backgroundColor: theme.colors.backgroundElevated,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Feather name="search" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals/index"
        options={{
          title: 'Deals',
          tabBarIcon: ({ color }) => <Feather name="tag" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved/index"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Feather name="heart" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="premium-savings/index" options={{ href: null }} />
    </Tabs>
  );
}
