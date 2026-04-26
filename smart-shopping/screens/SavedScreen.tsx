import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

import { PremiumProductCard } from '@/components/premium/PremiumProductCard';
import { SectionHeader } from '@/components/premium/SectionHeader';
import { theme } from '@/constants/theme';
import { getCatalogProduct, getPriceStatus, simulatePriceHistory } from '@/data/mockData';
import { useWishlist } from '@/context/WishlistContext';

export function SavedScreen() {
  const { ids } = useWishlist();
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const tracked = useMemo(
    () =>
      [...ids]
        .map((id) => getCatalogProduct(id))
        .filter(Boolean)
        .map((item) => {
          const best = item!.offers[item!.bestOfferIndex];
          return {
            id: item!.id,
            title: item!.title,
            image: item!.image,
            price: best.price,
            platform: best.platform,
            status: getPriceStatus(best.price),
            history: simulatePriceHistory(best.price),
          };
        }),
    [ids],
  );

  return (
    <View style={styles.page}>
      <FlatList
        data={tracked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Tracked Products</Text>
            <Text style={styles.subtitle}>Monitor live pricing trends and get alerted when value improves.</Text>
            <View style={styles.toggleCard}>
              <Text style={styles.toggleLabel}>Price-drop notifications</Text>
              <Switch
                value={alertsEnabled}
                onValueChange={setAlertsEnabled}
                trackColor={{ false: '#CBD5E1', true: theme.colors.primary }}
              />
            </View>
            <SectionHeader title="Tracked list" subtitle={`${tracked.length} active products`} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrap}>
            <PremiumProductCard
              title={item.title}
              image={item.image}
              price={item.price}
              platform={item.platform}
              subtitle={item.status}
            />
            <View style={styles.historyWrap}>
              <Text style={styles.historyLabel}>Price history</Text>
              <Text style={styles.historyData}>
                {formatHistory(item.history)}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={<View style={{ height: 84 }} />}
      />
    </View>
  );
}

function formatHistory(points: number[]) {
  let result = '';
  points.forEach((value, index) => {
    result += `Rs ${value.toLocaleString('en-IN')}`;
    if (index < points.length - 1) result += '  ->  ';
  });
  return result;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 110,
  },
  header: { gap: 10, marginBottom: 16 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: theme.colors.subtext, fontSize: 14 },
  toggleCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { color: theme.colors.text, fontWeight: '600' },
  itemWrap: { gap: 8 },
  historyWrap: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 10,
  },
  historyLabel: { fontSize: 12, color: theme.colors.subtext, fontWeight: '700' },
  historyData: { marginTop: 4, color: theme.colors.text, fontSize: 12, fontWeight: '600' },
});
