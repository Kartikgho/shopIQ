import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { DealCard } from '@/components/premium/DealCard';
import { SectionHeader } from '@/components/premium/SectionHeader';
import { dealsProducts } from '@/data/mockData';
import { useDealReactions } from '@/hooks/useDealReactions';
import { theme } from '@/constants/theme';
import type { DealReaction } from '@/types';
import { useRouter } from 'expo-router';
import { hrefCompare } from '@/utils/hrefs';
import { fetchDealsCards } from '@/services/catalogApi';
import type { Product } from '@/types';

export function DealsScreen() {
  const router = useRouter();
  const { getReaction, setReaction } = useDealReactions();
  const [items, setItems] = useState<Product[]>(dealsProducts);

  const onToggleReaction = (dealId: string, r: DealReaction) => {
    const current = getReaction(dealId);
    if (current === r) setReaction(dealId, null);
    else setReaction(dealId, r);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const remote = await fetchDealsCards();
        if (remote.length > 0) setItems(remote);
      } catch {
        setItems(dealsProducts);
      }
    };
    void load();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Premium Deals</Text>
            <Text style={styles.sub}>High-value offers with live discount tags and quick compare actions.</Text>
            <SectionHeader title="Popular deals" subtitle="Best picks across top stores" />
          </View>
        }
        renderItem={({ item }) => (
          <DealCard
            title={item.title}
            image={item.image}
            price={item.price}
            oldPrice={item.oldPrice}
            discount={item.discount}
            platform={item.platform ?? 'Top store'}
            onPress={() => router.push(hrefCompare(item.id))}
            onSave={() => onToggleReaction(item.id, 'like')}
          />
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
  },
  headerBlock: {
    marginBottom: 16,
    gap: 10,
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
});
