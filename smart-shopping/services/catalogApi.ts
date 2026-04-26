import { API_URL } from '@/constants/env';
import type { CatalogProduct, PlatformOffer, Product } from '@/types';

type SearchItem = Record<string, unknown>;
type DealsItem = Record<string, unknown>;
type ProductDetail = Record<string, unknown>;
type ProductVariant = Record<string, unknown>;
type PriceItem = Record<string, unknown>;

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string; details?: unknown } | null;
};

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const apiBase = (() => {
  const base = trimSlash(API_URL);
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
})();

const toQuery = (params?: Record<string, string | number | boolean | undefined>) => {
  if (!params) return '';
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    qp.set(key, String(value));
  });
  const out = qp.toString();
  return out ? `?${out}` : '';
};

async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const url = `${apiBase}${path}${toQuery(params)}`;
  const res = await fetch(url);
  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = null;
  }

  if (!res.ok || !body?.success) {
    const message = body?.error?.message ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return body.data;
}

const asString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);
const asNumber = (value: unknown, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

const formatReviews = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}`;
  return '0';
};

const titleToEmoji = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('iphone') || t.includes('samsung') || t.includes('oneplus')) return '📱';
  if (t.includes('watch')) return '⌚';
  if (t.includes('earbuds') || t.includes('headphone')) return '🎧';
  if (t.includes('tv')) return '📺';
  if (t.includes('mixer') || t.includes('grinder')) return '🥤';
  return '🛍️';
};

const mapOffer = (row: PriceItem): PlatformOffer => ({
  platform: asString(row.platform_name) || asString(row.platform_id, 'Store'),
  price: asNumber(row.selling_price, 0),
  deepLink: asString(row.affiliate_url) || asString(row.product_url, '#'),
  couponCode: asString(row.coupon_code) || undefined,
  couponLabel: asString(row.coupon_label) || undefined,
});

const mapSearchItem = (item: SearchItem): CatalogProduct => {
  const title = asString(item.title, 'Product');
  const offersRaw = Array.isArray(item.offers) ? (item.offers as PriceItem[]) : [];
  const offers = offersRaw.map(mapOffer).filter((offer) => offer.price >= 0);
  const best = offers.length ? offers.reduce((min, curr) => (curr.price < min.price ? curr : min), offers[0]) : null;

  return {
    id: asString(item.id) || asString(item.product_id) || title.toLowerCase().replace(/\s+/g, '-'),
    title,
    category: asString(item.category, 'all'),
    keywords: [],
    rating: asNumber(item.rating, 0),
    reviewCount: formatReviews(item.review_count ?? item.reviewCount),
    image: titleToEmoji(title),
    offers:
      offers.length > 0
        ? offers
        : [
            {
              platform: asString(item.platform, 'Store'),
              price: asNumber(item.best_price ?? item.price, 0),
              deepLink: '#',
            },
          ],
    bestOfferIndex: best ? offers.findIndex((o) => o === best) : 0,
    subtitle: asString(item.brand) || undefined,
  };
};

export async function fetchSearchProducts(query: string, country = 'IN', currency = 'INR') {
  const data = await apiGet<{ items?: SearchItem[] }>('/search', {
    q: query,
    country,
    currency,
    page: 1,
    limit: 20,
    sort: 'relevance',
  });
  return (data.items ?? []).map(mapSearchItem);
}

export async function fetchDealsCards(country = 'IN', currency = 'INR') {
  const data = await apiGet<{ items?: DealsItem[] }>('/deals', { country, currency, page: 1, limit: 20 });
  const rows = data.items ?? [];
  return rows.map(
    (item): Product => ({
      id: asString(item.id) || asString(item.product_id),
      title: asString(item.title, 'Deal'),
      image: titleToEmoji(asString(item.title, '')),
      price: asNumber(item.price ?? item.selling_price, 0),
      oldPrice: asNumber(item.old_price ?? item.mrp, 0) || undefined,
      discount: asString(item.discount_label) || asString(item.discount_percent) || undefined,
      platform: asString(item.platform_name) || asString(item.platform_id, 'Store'),
      subtitle: asString(item.tagline) || undefined,
    }),
  );
}

export async function fetchProductForCompare(productId: string, country = 'IN', currency = 'INR') {
  const product = await apiGet<ProductDetail>(`/products/${productId}`);
  const variantsRes = await apiGet<{ variants?: ProductVariant[] }>(`/products/${productId}/variants`);
  const variants = variantsRes.variants ?? [];
  const firstVariant = variants[0];
  if (!firstVariant) return null;

  const variantId = asString(firstVariant.id);
  if (!variantId) return null;

  const pricesRes = await apiGet<{ prices?: PriceItem[] }>(`/variants/${variantId}/prices`, { country, currency, in_stock_only: true });
  const offers = (pricesRes.prices ?? []).map(mapOffer).filter((offer) => offer.price >= 0);
  if (!offers.length) return null;
  const bestOffer = offers.reduce((min, curr) => (curr.price < min.price ? curr : min), offers[0]);

  const title = asString(product.title, 'Product');
  return {
    id: asString(product.id, productId),
    title,
    category: asString(product.category, 'all'),
    keywords: [],
    rating: asNumber(product.rating, 0),
    reviewCount: formatReviews(product.review_count ?? product.reviewCount),
    image: titleToEmoji(title),
    offers,
    bestOfferIndex: offers.findIndex((o) => o === bestOffer),
    subtitle: asString(product.brand) || undefined,
  } satisfies CatalogProduct;
}
