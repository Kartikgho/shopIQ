import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BannerCarousel } from '@/components/premium/BannerCarousel';
import { FilterChips } from '@/components/premium/FilterChips';
import { FloatingActionButton } from '@/components/premium/FloatingActionButton';
import { PremiumProductCard } from '@/components/premium/PremiumProductCard';
import { PremiumSearchBar } from '@/components/premium/PremiumSearchBar';
import { SectionHeader } from '@/components/premium/SectionHeader';
import { theme } from '@/constants/theme';
import { categories, getFeaturedProducts, homeBanners } from '@/data/mockData';
import { hrefCompare } from '@/utils/hrefs';

export function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const featured = getFeaturedProducts();

  const filtered = useMemo(() => {
    if (categoryId === 'all') return featured;
    return featured.filter((item) => item.category === categoryId);
  }, [categoryId, featured]);

  return (
    <View style={styles.page}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.greeting}>Welcome to IQ</Text>
            <Text style={styles.subtitle}>Smarter shopping starts here</Text>
            <PremiumSearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search products, categories, brands"
              onSubmit={() => router.push({ pathname: '/search', params: { q: query } })}
            />
            <BannerCarousel items={homeBanners} />
            <SectionHeader title="Categories" subtitle="Personalized picks for your shopping style" />
            <FilterChips items={categories} selectedId={categoryId} onSelect={setCategoryId} />
            <SectionHeader title="Featured Deals" actionLabel="View all" onActionPress={() => router.push('/deals')} />
          </View>
        }
        renderItem={({ item }) => (
          <PremiumProductCard
            title={item.title}
            image={item.image}
            price={item.offers[item.bestOfferIndex].price}
            platform={item.offers[item.bestOfferIndex].platform}
            subtitle={`${item.rating} stars · ${item.reviewCount} reviews`}
            onPress={() => router.push(hrefCompare(item.id))}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={<View style={{ height: 84 }} />}
      />
      <FloatingActionButton onPress={() => router.push('/search')} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerBlock: { gap: 16, marginBottom: 16 },
  greeting: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: theme.colors.subtext,
    fontSize: 14,
    marginTop: -10,
    marginBottom: 4,
  },
});
