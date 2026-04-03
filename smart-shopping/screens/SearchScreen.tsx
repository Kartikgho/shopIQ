import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { SearchBar } from '@/components/SearchBar';
import { SearchResultRow } from '@/components/SearchResultRow';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { getCatalogProduct, searchCatalog } from '@/data/mockData';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { useWishlist } from '@/context/WishlistContext';
import { theme } from '@/constants/theme';

export function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const { items: recent, add, clear } = useSearchHistory();
  const { ids } = useWishlist();

  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');

  useEffect(() => {
    if (typeof params.q === 'string') setQuery(params.q);
  }, [params.q]);

  const results = useMemo(() => searchCatalog(query), [query]);

  const trackedProducts = useMemo(
    () =>
      [...ids]
        .map((id) => getCatalogProduct(id))
        .filter(Boolean)
        .map((p) => ({
          id: p!.id,
          title: p!.title,
          image: p!.image,
          price: p!.offers[p!.bestOfferIndex].price,
          subtitle: 'Saved · tap to compare',
        })),
    [ids],
  );

  const runSearch = () => {
    void add(query);
  };

  return (
    <View style={styles.page}>
      <Header />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.block}>
            <SearchBar
              placeholder="iPhone, Boat, Sony..."
              value={query}
              onChangeText={setQuery}
              onSubmit={runSearch}
              onClear={() => setQuery('')}
              autoFocus={Boolean(params.q)}
            />
            {query.trim().length >= 2 ? (
              <Text style={styles.hint}>{results.length} result{results.length === 1 ? '' : 's'}</Text>
            ) : null}

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent searches</Text>
              {recent.length ? (
                <Pressable onPress={() => void clear()}>
                  <Text style={styles.clear}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            {recent.length === 0 ? (
              <Text style={styles.muted}>Your recent searches appear here</Text>
            ) : (
              <View style={styles.chips}>
                {recent.map((r) => (
                  <Pressable key={r} onPress={() => setQuery(r)} style={styles.chip}>
                    <Text style={styles.chipText}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Saved & tracked</Text>
            <Text style={styles.muted}>Opens compare view — no surprise store redirects</Text>
            {trackedProducts.length === 0 ? (
              <Text style={styles.mutedSmall}>Save items from a compare screen to see them here</Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          query.trim().length >= 2 ? (
            <Text style={styles.empty}>No matches in demo catalog. Try “iPhone”, “boat”, or “sony”.</Text>
          ) : null
        }
        renderItem={({ item }) => <SearchResultRow product={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={
          trackedProducts.length ? (
            <View style={styles.tracked}>
              {trackedProducts.map((p) => (
                <View key={p.id} style={styles.trackedCard}>
                  <ProductCard product={p} mode="tracked" />
                </View>
              ))}
            </View>
          ) : null
        }
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
    gap: 12,
  },
  block: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  clear: {
    ...theme.typography.caption,
    color: theme.colors.primaryMid,
    fontWeight: '700',
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  mutedSmall: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  tracked: {
    marginTop: theme.spacing.lg,
    gap: 12,
  },
  trackedCard: {
    marginBottom: 4,
  },
});
