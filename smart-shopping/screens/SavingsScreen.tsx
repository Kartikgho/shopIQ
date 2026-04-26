import { FlatList, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/premium/SectionHeader';
import { theme } from '@/constants/theme';
import { recentSavings, savingsBreakdown, savingsMonthly } from '@/data/mockData';

export function SavingsScreen() {
  const peak = Math.max(...savingsMonthly, 1);
  return (
    <View style={styles.page}>
      <FlatList
        data={recentSavings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Savings</Text>
            <Text style={styles.sub}>Track your total money saved through price intelligence.</Text>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Saved</Text>
              <Text style={styles.totalValue}>Rs 16,450</Text>
              <Text style={styles.totalHint}>+12% vs last month</Text>
            </View>
            <SectionHeader title="Monthly graph" subtitle="Last 4 months" />
            <View style={styles.chartWrap}>
              <FlatList
                horizontal
                data={savingsMonthly}
                keyExtractor={(_, i) => `m-${i}`}
                contentContainerStyle={styles.chartRow}
                renderItem={({ item, index }) => (
                  <View style={styles.barCol}>
                    <View style={[styles.bar, { height: Math.max(24, (item / peak) * 130) }]} />
                    <Text style={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr'][index]}</Text>
                  </View>
                )}
              />
            </View>
            <SectionHeader title="Savings breakdown" />
            <View style={styles.breakdownWrap}>
              <FlatList
                data={savingsBreakdown}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>{item.label}</Text>
                    <Text style={styles.breakdownAmount}>Rs {item.amount.toLocaleString('en-IN')}</Text>
                  </View>
                )}
              />
            </View>
            <SectionHeader title="Recent savings list" />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.savingItem}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </View>
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
    gap: 12,
    paddingBottom: 110,
  },
  header: { gap: 14, marginBottom: 4 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.7 },
  sub: { color: theme.colors.subtext, fontSize: 14 },
  totalCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    padding: 18,
    ...theme.shadow.card,
  },
  totalLabel: { color: '#E0E7FF', fontSize: 12, fontWeight: '700' },
  totalValue: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', marginTop: 4 },
  totalHint: { color: '#EEF2FF', fontSize: 12, marginTop: 4, fontWeight: '600' },
  chartWrap: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    ...theme.shadow.soft,
  },
  chartRow: { gap: 16, alignItems: 'flex-end', paddingHorizontal: 10 },
  barCol: { alignItems: 'center', gap: 8 },
  bar: { width: 28, backgroundColor: theme.colors.primary, borderRadius: 14 },
  barLabel: { color: theme.colors.subtext, fontSize: 12, fontWeight: '600' },
  breakdownWrap: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
  },
  breakdownItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  breakdownLabel: { color: theme.colors.text, fontWeight: '600' },
  breakdownAmount: { color: theme.colors.primary, fontWeight: '800' },
  savingItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...theme.shadow.soft,
  },
  emoji: {
    fontSize: 28,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemSubtitle: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 2,
  },
  time: {
    color: theme.colors.subtext,
    fontSize: 12,
    fontWeight: '600',
  },
});
