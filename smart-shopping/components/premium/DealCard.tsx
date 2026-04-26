import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  platform: string;
  onPress?: () => void;
  onSave?: () => void;
};

export function DealCard({ title, image, price, oldPrice, discount, platform, onPress, onSave }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]} onPress={onPress}>
      {discount ? (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}</Text>
        </View>
      ) : null}
      <View style={styles.top}>
        <Text style={styles.image}>{image}</Text>
        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSave?.();
          }}
          style={styles.iconBtn}>
          <Feather name="heart" size={16} color={theme.colors.subtext} />
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.platform}>{platform}</Text>
      <View style={styles.prices}>
        <Text style={styles.price}>Rs {price.toLocaleString('en-IN')}</Text>
        {oldPrice ? <Text style={styles.oldPrice}>Rs {oldPrice.toLocaleString('en-IN')}</Text> : null}
      </View>
      <Pressable style={styles.grabBtn} onPress={onPress}>
        <Text style={styles.grabText}>Grab Deal</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    ...theme.shadow.card,
    gap: 8,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  image: { fontSize: 36 },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  platform: { color: theme.colors.subtext, fontSize: 13, fontWeight: '600' },
  prices: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { color: theme.colors.text, fontSize: 20, fontWeight: '800' },
  oldPrice: { color: theme.colors.subtext, fontSize: 13, textDecorationLine: 'line-through' },
  grabBtn: {
    marginTop: 4,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  grabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
