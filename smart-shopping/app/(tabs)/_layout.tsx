import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { BottomTabBar } from '@/components/premium/BottomTabBar';
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
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="deals/index"
        options={{
          title: 'Deals',
        }}
      />
      <Tabs.Screen
        name="wishlist/index"
        options={{
          title: 'Wishlist',
        }}
      />
      <Tabs.Screen
        name="saved/index"
        options={{
          title: 'Saved',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
