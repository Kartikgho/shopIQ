import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { theme } from '@/constants/theme';

const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
  home: 'home',
  search: 'search',
  deals: 'tag',
  wishlist: 'heart',
  saved: 'bookmark',
  profile: 'user',
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const label = typeof options.title === 'string' ? options.title : route.name;
          const iconName = iconMap[route.name.split('/')[0]] ?? 'circle';

          return (
            <Pressable
              key={route.key}
              style={styles.item}
              onPress={() => navigation.navigate(route.name)}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}>
              <Feather name={iconName} size={19} color={focused ? theme.colors.primary : theme.colors.subtext} />
              <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inner: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    ...theme.shadow.soft,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: {
    fontSize: 11,
    color: theme.colors.subtext,
    fontWeight: '600',
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
