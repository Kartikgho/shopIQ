import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  title: string;
  image: string;
  price: number;
  platform: string;
  subtitle?: string;
  onPress?: () => void;
  rightBadge?: string;
};

export function PremiumProductCard({
  title,
  image,
  price,
  platform,
  subtitle,
  onPress,
  rightBadge,
}: Props) {
  return (
    <Pressable
      onPress={async () => {
        await Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.left}>
        <View style={styles.thumb}>
          <Text style={styles.emoji}>{image}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.platform}>{platform}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.price}>Rs {price.toLocaleString('en-IN')}</Text>
      </View>
      <View style={styles.right}>
        {rightBadge ? <Text style={styles.badge}>{rightBadge}</Text> : null}
        <Feather name="chevron-right" size={18} color={theme.colors.subtext} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadow.soft,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  left: { alignSelf: 'stretch', justifyContent: 'center' },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  body: { flex: 1, gap: 2 },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  platform: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
  },
  price: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 12,
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.accent,
  },
});
