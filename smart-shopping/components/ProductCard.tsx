import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { Product } from '@/types';
import { theme } from '@/constants/theme';
import { formatINR } from '@/utils/price';
import { shareDealLink } from '@/utils/share';
import { getCatalogProduct } from '@/data/mockData';
import { hrefCompare } from '@/utils/hrefs';
import { withAffiliateParams } from '@/utils/affiliate';
import type { DealReaction } from '@/types';

type ProductCardProps = {
  product: Product;
  mode?: 'tracked' | 'deal';
  reaction?: DealReaction | null;
  onToggleReaction?: (r: DealReaction) => void;
};

export function ProductCard({ product, mode = 'deal', reaction, onToggleReaction }: ProductCardProps) {
  const router = useRouter();
  const cat = getCatalogProduct(product.id);
  const dealUrl = cat?.offers[cat.bestOfferIndex]?.deepLink ?? `https://example.com/deal/${product.id}`;

  const openCompare = () => {
    router.push(hrefCompare(product.id));
  };

  const share = () => {
    void shareDealLink({
      title: product.title,
      targetUrl: dealUrl,
      messagePrefix: `${product.title} — compared on SmartShopping`,
    });
  };

  return (
    <Pressable onPress={mode === 'deal' ? openCompare : undefined} style={styles.card}>
      <View style={styles.imageWrap}>
        <Text style={styles.image}>{product.image}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        {product.subtitle ? <Text style={styles.subtitle}>{product.subtitle}</Text> : null}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatINR(product.price)}</Text>
          {product.oldPrice ? <Text style={styles.oldPrice}>{formatINR(product.oldPrice)}</Text> : null}
        </View>
        {mode === 'deal' ? (
          <View style={styles.metrics}>
            {product.discount ? <Text style={styles.discount}>{product.discount} off</Text> : <View />}
            <Text style={styles.meta}>
              ↑ {product.likes} · 👁 {product.views}
            </Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          {mode === 'deal' && onToggleReaction ? (
            <View style={styles.reactRow}>
              <Pressable
                onPress={() => onToggleReaction('like')}
                style={[styles.reactBtn, reaction === 'like' && styles.reactActive]}>
                <Feather name="heart" size={18} color={reaction === 'like' ? theme.colors.danger : theme.colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => onToggleReaction('fire')}
                style={[styles.reactBtn, reaction === 'fire' && styles.reactActive]}>
                <Text style={{ fontSize: 16 }}>{reaction === 'fire' ? '🔥' : '✨'}</Text>
              </Pressable>
              <Pressable onPress={share} style={styles.reactBtn}>
                <Feather name="share-2" size={18} color={theme.colors.primaryMid} />
              </Pressable>
            </View>
          ) : null}
          {mode === 'tracked' ? (
            <CustomButton label="View compare" variant="outline" onPress={openCompare} />
          ) : (
            <View style={styles.dealButtons}>
              <CustomButton label="Compare prices" variant="outline" onPress={openCompare} />
              <CustomButton
                label="Grab deal"
                onPress={() => {
                  void WebBrowser.openBrowserAsync(withAffiliateParams(dealUrl));
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.md,
    flexDirection: 'row',
    gap: 12,
    ...theme.shadow.soft,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    fontSize: 36,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 22,
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  oldPrice: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discount: {
    color: theme.colors.success,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  meta: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  actions: {
    marginTop: 4,
    gap: 10,
  },
  reactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reactBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
  },
  reactActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentMuted,
  },
  dealButtons: {
    gap: 8,
  },
});
