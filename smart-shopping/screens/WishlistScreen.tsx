import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { getCatalogProduct } from '@/data/mockData';
import { useWishlist } from '@/context/WishlistContext';
import { theme } from '@/constants/theme';

export function WishlistScreen() {
  const router = useRouter();
  const { ids } = useWishlist();

  const products = [...ids]
    .map((id) => {
      const p = getCatalogProduct(id);
      if (!p) return null;
      const best = p.offers[p.bestOfferIndex];
      return {
        id: p.id,
        title: p.title,
        image: p.image,
        price: best.price,
        subtitle: `${best.platform} · ${p.rating} ★`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <View style={styles.page}>
      <Header title="Wishlist" />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.sub}>Saved items open the compare view first — stay in control before visiting a store.</Text>
            <Pressable onPress={() => router.push('/search')} style={styles.linkBtn}>
              <Text style={styles.linkText}>Find more to save</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySub}>Tap the heart on any compare screen to add it here.</Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} mode="tracked" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 520,
    padding: theme.spacing.lg,
    paddingBottom: 120,
    flexGrow: 1,
  },
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sub: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkText: {
    ...theme.typography.caption,
    color: theme.colors.primaryMid,
    fontWeight: '800',
  },
  empty: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  emptySub: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
