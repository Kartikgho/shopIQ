import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { dealsProducts } from '@/data/mockData';
import { useDealReactions } from '@/hooks/useDealReactions';
import { theme } from '@/constants/theme';
import type { DealReaction } from '@/types';

export function DealsScreen() {
  const { getReaction, setReaction } = useDealReactions();

  const onToggleReaction = (dealId: string, r: DealReaction) => {
    const current = getReaction(dealId);
    if (current === r) setReaction(dealId, null);
    else setReaction(dealId, r);
  };

  return (
    <View style={styles.page}>
      <Header />
      <FlatList
        data={dealsProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.kicker}>Curated for you</Text>
            <Text style={styles.title}>Today&apos;s standout deals</Text>
            <Text style={styles.sub}>Share with friends or react — we&apos;ll tune alerts from your taste.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            mode="deal"
            reaction={getReaction(item.id)}
            onToggleReaction={(r) => onToggleReaction(item.id, r)}
          />
        )}
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
  },
  headerBlock: {
    marginBottom: theme.spacing.lg,
    gap: 6,
  },
  kicker: {
    ...theme.typography.micro,
    color: theme.colors.primaryMid,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    ...theme.typography.hero,
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  sub: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
