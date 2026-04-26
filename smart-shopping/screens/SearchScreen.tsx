import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/premium/FilterChips';
import { LoadingSkeleton } from '@/components/premium/LoadingSkeleton';
import { PremiumProductCard } from '@/components/premium/PremiumProductCard';
import { PremiumSearchBar } from '@/components/premium/PremiumSearchBar';
import { SectionHeader } from '@/components/premium/SectionHeader';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { theme } from '@/constants/theme';
import { categories, searchCatalog, trendingSearches } from '@/data/mockData';
import { fetchSearchProducts } from '@/services/catalogApi';
import { hrefCompare } from '@/utils/hrefs';
import type { CatalogProduct } from '@/types';

export function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const { items: recent, add, clear } = useSearchHistory();
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [results, setResults] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    if (typeof params.q === 'string') setQuery(params.q);
  }, [params.q]);

  const filteredResults = useMemo(() => {
    if (selectedFilter === 'all') return results;
    return results.filter((item) => item.category === selectedFilter);
  }, [results, selectedFilter]);

  const runSearch = async () => {
    const normalized = query.trim();
    void add(query);
    if (normalized.length < 2) {
      setResults([]);
      setIsTyping(false);
      return;
    }

    try {
      const apiResults = await fetchSearchProducts(normalized);
      setResults(apiResults);
    } catch {
      setResults(searchCatalog(normalized));
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (typeof params.q === 'string' && params.q.trim().length >= 2) {
      void runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q]);

  return (
    <View style={styles.page}>
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.block}>
            <Text style={styles.title}>Search</Text>
            <PremiumSearchBar
              placeholder="iPhone, smart TV, headphones..."
              value={query}
              onChangeText={(value) => {
                setIsTyping(true);
                setQuery(value);
              }}
              onSubmit={runSearch}
            />
            {isTyping && query.length > 1 ? (
              <View style={styles.loaderWrap}>
                <LoadingSkeleton height={70} />
              </View>
            ) : null}
            <SectionHeader title="Filters" subtitle="Sort and narrow instantly" />
            <FilterChips items={categories} selectedId={selectedFilter} onSelect={setSelectedFilter} />
            <SectionHeader title="Recent Searches" actionLabel="Clear" onActionPress={() => void clear()} />
            <FlatList
              horizontal
              data={recent.length ? recent : trendingSearches}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.chips}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable onPress={() => setQuery(item)} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                </Pressable>
              )}
            />
            <SectionHeader title="Results" subtitle={`${filteredResults.length} products found`} />
          </View>
        }
        ListEmptyComponent={
          query.trim().length >= 2 && !isTyping ? (
            <Text style={styles.empty}>No matches found yet. Try iPhone, Sony, or Smart TV.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <PremiumProductCard
            title={item.title}
            image={item.image}
            price={item.offers[item.bestOfferIndex].price}
            platform={item.offers[item.bestOfferIndex].platform}
            subtitle={`${item.reviewCount} reviews`}
            onPress={() => router.push(hrefCompare(item.id))}
            rightBadge={`${item.rating}★`}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  },
  block: {
    gap: 16,
    marginBottom: 18,
  },
  title: {
    ...theme.typography.hero,
    color: theme.colors.text,
    fontSize: 30,
  },
  loaderWrap: { marginTop: -4 },
  chips: {
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    color: theme.colors.subtext,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
