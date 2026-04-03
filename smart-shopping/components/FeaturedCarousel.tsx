import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { hrefCompare } from '@/utils/hrefs';
import { formatINR } from '@/utils/price';
import type { CatalogProduct } from '@/types';

const CARD_WIDTH = Math.min(Dimensions.get('window').width - 56, 320);

type FeaturedCarouselProps = {
  products: CatalogProduct[];
};

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 14}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const best = item.offers[item.bestOfferIndex];
          return (
            <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
              <Pressable
                onPress={() => router.push(hrefCompare(item.id))}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}>
                <LinearGradient
                  colors={['#1a2f4d', '#2d5a8c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardInner}>
                  <View style={styles.badgeRow}>
                    <View style={styles.dealPill}>
                      <Text style={styles.dealPillText}>Featured</Text>
                    </View>
                    <Text style={styles.emoji}>{item.image}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatINR(best.price)}</Text>
                    <Text style={styles.platform}>{best.platform}</Text>
                  </View>
                  <Text style={styles.hint}>Compare all stores →</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -4,
  },
  listContent: {
    paddingVertical: 4,
    gap: 14,
    paddingRight: theme.spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  cardInner: {
    padding: theme.spacing.lg,
    minHeight: 168,
    justifyContent: 'flex-end',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dealPill: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  dealPillText: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  emoji: {
    fontSize: 36,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 4,
  },
  price: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  platform: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
