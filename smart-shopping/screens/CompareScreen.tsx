import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { CustomButton } from '@/components/CustomButton';
import { ShareIconButton } from '@/components/ShareIconButton';
import { getCatalogProduct, getSimilarProducts, lowestPrice } from '@/data/mockData';
import { useWishlist } from '@/context/WishlistContext';
import { theme } from '@/constants/theme';
import { fetchProductForCompare } from '@/services/catalogApi';
import { formatINR } from '@/utils/price';
import { hrefCompare } from '@/utils/hrefs';
import { shareDealLink } from '@/utils/share';
import { withAffiliateParams } from '@/utils/affiliate';
import type { CatalogProduct } from '@/types';

export function CompareScreen() {
  const { id: paramId } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const { isSaved, toggle } = useWishlist();

  const id = Array.isArray(paramId) ? paramId[0] : paramId;
  const localProduct = id ? getCatalogProduct(id) : undefined;
  const [apiProduct, setApiProduct] = useState<CatalogProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id || localProduct) return;
      setIsLoading(true);
      try {
        const remote = await fetchProductForCompare(id);
        setApiProduct(remote);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id, localProduct]);

  const product = localProduct ?? apiProduct ?? undefined;

  if (!product && isLoading) {
    return (
      <View style={styles.page}>
        <Header title="Compare" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Loading product...</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.page}>
        <Header title="Not found" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Product unavailable</Text>
          <CustomButton label="Back to search" variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const { price: floorPrice, index: floorIndex } = lowestPrice(product);
  const bestIdx = product.bestOfferIndex;
  const saved = isSaved(product.id);

  const shareBest = () => {
    const offer = product.offers[bestIdx];
    void shareDealLink({
      title: product.title,
      targetUrl: offer.deepLink,
      messagePrefix: `Best deal for ${product.title} on ${offer.platform}`,
    });
  };

  return (
    <View style={styles.page}>
      <Header
        title="Compare"
        showBack
        right={
          <View style={styles.headerRight}>
            <Pressable
              onPress={() => void toggle(product.id)}
              style={({ pressed }) => [styles.iconRound, pressed && { opacity: 0.85 }]}>
              <Feather name="heart" size={20} color={saved ? theme.colors.danger : '#fff'} />
            </Pressable>
            <ShareIconButton onPress={shareBest} />
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <View style={styles.heroEmoji}>
            <Text style={styles.emoji}>{product.image}</Text>
          </View>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={16} color={theme.colors.rating} />
            <Text style={styles.ratingText}>
              {product.rating} · {product.reviewCount} reviews
            </Text>
          </View>
          <View style={styles.pills}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Lowest {formatINR(floorPrice)}</Text>
            </View>
            <View style={[styles.pill, styles.pillAccent]}>
              <Text style={styles.pillTextDark}>Best deal: {product.offers[bestIdx].platform}</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.sectionLabel}>Store prices</Text>
        {product.offers.map((offer, i) => {
          const isLowest = i === floorIndex;
          const isBestPick = i === bestIdx;
          const hasCoupon = Boolean(offer.couponCode);
          return (
            <Animated.View
              entering={FadeInDown.delay(80 * i)}
              key={`${offer.platform}-${i}`}
              style={[
                styles.offerCard,
                isLowest && styles.offerCardHighlight,
                isBestPick && styles.offerCardBest,
              ]}>
              <View style={styles.offerTop}>
                <View>
                  <Text style={styles.platform}>{offer.platform}</Text>
                  <Text style={[styles.offerPrice, isLowest && styles.offerPriceLow]}>{formatINR(offer.price)}</Text>
                </View>
                <View style={styles.badges}>
                  {isLowest ? (
                    <View style={styles.badgeLow}>
                      <Text style={styles.badgeLowText}>Lowest price</Text>
                    </View>
                  ) : null}
                  {isBestPick ? (
                    <View style={styles.badgeBest}>
                      <Text style={styles.badgeBestText}>Best deal</Text>
                    </View>
                  ) : null}
                  {hasCoupon ? (
                    <View style={styles.badgeCoupon}>
                      <Feather name="percent" size={12} color="#fff" />
                      <Text style={styles.badgeCouponText}>Coupon</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {offer.couponLabel ? (
                <Text style={styles.couponHint}>
                  {offer.couponLabel}
                  {offer.couponCode ? ` · Code ${offer.couponCode}` : ''}
                </Text>
              ) : null}
              <CustomButton
                label="Grab deal"
                variant={isBestPick ? 'primary' : 'outline'}
                onPress={() => void WebBrowser.openBrowserAsync(withAffiliateParams(offer.deepLink))}
              />
            </Animated.View>
          );
        })}

        <Text style={styles.sectionLabel}>Similar picks</Text>
        {localProduct ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarList}>
            {getSimilarProducts(localProduct).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(hrefCompare(item.id))}
                style={({ pressed }) => [styles.similarCard, pressed && { opacity: 0.92 }]}>
                <Text style={styles.similarEmoji}>{item.image}</Text>
                <Text style={styles.similarTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.similarFrom}>from {formatINR(lowestPrice(item).price)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconRound: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    ...theme.shadow.card,
    marginBottom: theme.spacing.lg,
  },
  heroEmoji: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emoji: {
    fontSize: 38,
  },
  title: {
    ...theme.typography.hero,
    color: theme.colors.textPrimary,
    lineHeight: 30,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  pill: {
    backgroundColor: theme.colors.successMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  pillAccent: {
    backgroundColor: theme.colors.accentMuted,
  },
  pillText: {
    ...theme.typography.micro,
    color: theme.colors.bestDeal,
    fontWeight: '700',
  },
  pillTextDark: {
    ...theme.typography.micro,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  sectionLabel: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  offerCard: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadow.soft,
  },
  offerCardHighlight: {
    borderColor: theme.colors.success,
    borderWidth: 1.5,
  },
  offerCardBest: {
    borderColor: theme.colors.accent,
  },
  offerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  platform: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  offerPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  offerPriceLow: {
    color: theme.colors.bestDeal,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
    flex: 1,
  },
  badgeLow: {
    backgroundColor: theme.colors.successMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeLowText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.bestDeal,
  },
  badgeBest: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeBestText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  badgeCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.coupon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeCouponText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  couponHint: {
    ...theme.typography.caption,
    color: theme.colors.coupon,
    fontWeight: '600',
  },
  similarList: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  similarCard: {
    width: 132,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.md,
    ...theme.shadow.soft,
  },
  similarEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  similarTitle: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    minHeight: 36,
  },
  similarFrom: {
    ...theme.typography.micro,
    color: theme.colors.primaryMid,
    marginTop: 6,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...theme.typography.title,
    color: theme.colors.textSecondary,
  },
});
