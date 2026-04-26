import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/premium/SectionHeader';
import { WishlistCard } from '@/components/premium/WishlistCard';
import { useWishlist } from '@/context/WishlistContext';
import { theme } from '@/constants/theme';
import { getCatalogProduct, getPriceStatus } from '@/data/mockData';
import { hrefCompare } from '@/utils/hrefs';

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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Wishlist</Text>
            <Text style={styles.sub}>Your premium save list with instant visibility into price movement.</Text>
            <SectionHeader title="Saved products" subtitle={`${products.length} items`} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>Your wishlist is waiting</Text>
            <Text style={styles.emptySub}>Save any product to watch drops and compare smarter.</Text>
            <Pressable onPress={() => router.push('/search')} style={styles.linkBtn}>
              <Text style={styles.linkText}>Explore products</Text>
            </Pressable>
          </View>
        }
        numColumns={2}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        renderItem={({ item }) => (
          <Pressable style={{ flex: 1 }} onPress={() => router.push(hrefCompare(item.id))}>
            <WishlistCard
              title={item.title}
              image={item.image}
              price={item.price}
              status={getPriceStatus(item.price)}
            />
          </Pressable>
        )}
        ListFooterComponent={<View style={{ height: 84 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 110,
    flexGrow: 1,
  },
  header: {
    gap: 10,
    marginBottom: 18,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  sub: {
    color: theme.colors.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  linkBtn: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.soft,
  },
  emptyIcon: {
    fontSize: 46,
    color: theme.colors.primary,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  emptySub: {
    color: theme.colors.subtext,
    fontSize: 14,
    textAlign: 'center',
  },
});
