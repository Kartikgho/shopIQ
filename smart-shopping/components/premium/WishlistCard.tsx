import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  title: string;
  image: string;
  price: number;
  status: string;
};

export function WishlistCard({ title, image, price, status }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.image}>{image}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.price}>Rs {price.toLocaleString('en-IN')}</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 160,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    ...theme.shadow.soft,
    gap: 6,
  },
  image: { fontSize: 30 },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  price: { color: theme.colors.primary, fontSize: 16, fontWeight: '800' },
  status: { color: theme.colors.subtext, fontSize: 12, fontWeight: '600' },
});
