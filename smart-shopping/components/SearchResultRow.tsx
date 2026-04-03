import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { hrefCompare } from '@/utils/hrefs';
import { formatINR } from '@/utils/price';
import { lowestPrice } from '@/data/mockData';
import type { CatalogProduct } from '@/types';

type SearchResultRowProps = {
  product: CatalogProduct;
};

export function SearchResultRow({ product }: SearchResultRowProps) {
  const router = useRouter();
  const { price, index } = lowestPrice(product);
  const best = product.offers[product.bestOfferIndex];
  const lowMatch = product.offers[index].platform === best.platform && product.offers[index].price === best.price;

  return (
    <Pressable
      onPress={() => router.push(hrefCompare(product.id))}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.image}>
        <Text style={styles.emoji}>{product.image}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={14} color={theme.colors.rating} />
          <Text style={styles.ratingText}>
            {product.rating} · {product.reviewCount} reviews
          </Text>
        </View>
        <Text style={styles.compareHint}>
          From {formatINR(price)} · {product.offers.length} stores
          {lowMatch ? '' : ` · Best pick: ${best.platform}`}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.md,
    gap: 12,
    ...theme.shadow.soft,
  },
  rowPressed: {
    opacity: 0.92,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  compareHint: {
    ...theme.typography.micro,
    color: theme.colors.primaryMid,
    marginTop: 2,
  },
});
