import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { Header } from '@/components/Header';
import { recentSavings, savingsMonthly } from '@/data/mockData';
import { theme } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;

export function SavingsScreen() {
  return (
    <View style={styles.page}>
      <Header title="Premium Savings" showBack />
      <FlatList
        data={recentSavings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.proBanner}>
              <LinearGradient
                colors={[theme.colors.accent, '#a67c1f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.proPill}>
                <Text style={styles.proPillText}>PRO</Text>
              </LinearGradient>
              <Text style={styles.proCaption}>Member savings intelligence</Text>
            </View>
            <View style={styles.savingsRow}>
              <LinearGradient
                colors={['#152a45', theme.colors.primaryMid]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.valueCard, styles.cardFrame]}>
                <Text style={styles.valueLabel}>Total savings</Text>
                <Text style={styles.valueText}>₹16,450</Text>
              </LinearGradient>
              <LinearGradient
                colors={['#5c1a1a', theme.colors.danger]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.valueCard, styles.cardFrame]}>
                <Text style={styles.valueLabel}>Coupon savings</Text>
                <Text style={styles.valueText}>₹1,200 off</Text>
              </LinearGradient>
            </View>
            <View style={styles.chartWrap}>
              <Text style={styles.sectionTitle}>Savings overview</Text>
              <Text style={styles.sectionHint}>Rolling 4-month trend (mock)</Text>
              <BarChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                  datasets: [{ data: savingsMonthly }],
                }}
                width={Math.min(screenWidth - 44, 420)}
                height={200}
                fromZero
                yAxisLabel="₹"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: theme.colors.backgroundElevated,
                  backgroundGradientTo: theme.colors.backgroundElevated,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(201, 162, 39, ${opacity})`,
                  labelColor: () => theme.colors.textSecondary,
                  propsForBackgroundLines: { strokeDasharray: '' },
                  barPercentage: 0.5,
                }}
                style={styles.chart}
              />
            </View>
            <Text style={styles.listSectionTitle}>Recent wins</Text>
          </>
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
        ListFooterComponent={
          <View style={styles.rateBox}>
            <Text style={styles.rateText}>Rate us</Text>
            <Text style={styles.stars}>★★★★★</Text>
          </View>
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
    gap: 12,
    paddingBottom: 80,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  proPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  proPillText: {
    color: '#1a1406',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  proCaption: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  savingsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  valueCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    padding: 14,
  },
  cardFrame: {
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.45)',
    ...theme.shadow.card,
  },
  valueLabel: {
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  valueText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 26,
    marginTop: 6,
    letterSpacing: -0.5,
  },
  chartWrap: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accentMuted,
    paddingVertical: 12,
    marginTop: 6,
    ...theme.shadow.soft,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: 12,
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
    paddingHorizontal: 12,
    marginBottom: 6,
    marginTop: 2,
  },
  listSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 8,
    letterSpacing: -0.2,
  },
  chart: {
    borderRadius: 12,
  },
  savingItem: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
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
    color: theme.colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  rateBox: {
    marginTop: 6,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  rateText: {
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  stars: {
    color: theme.colors.rating,
    fontSize: 18,
  },
});
