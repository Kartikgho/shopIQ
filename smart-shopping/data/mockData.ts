import { CatalogProduct, Product, RecentSaving } from '@/types';

export const platforms = ['amazon', 'flipkart', 'myntra', 'ajio', 'tata cliq'];

export const platformBrands: { id: string; label: string; abbr: string }[] = [
  { id: 'amazon', label: 'Amazon', abbr: 'Am' },
  { id: 'flipkart', label: 'Flipkart', abbr: 'Fk' },
  { id: 'myntra', label: 'Myntra', abbr: 'My' },
  { id: 'ajio', label: 'Ajio', abbr: 'Aj' },
  { id: 'tatacliq', label: 'Tata CLiQ', abbr: 'TC' },
];

export const catalog: CatalogProduct[] = [
  {
    id: 'p-iphone-13',
    title: 'iPhone 13 (128GB)',
    category: 'mobiles',
    keywords: ['iphone', 'apple', 'phone', '13'],
    rating: 4.6,
    reviewCount: '12.4k',
    image: '📱',
    bestOfferIndex: 1,
    offers: [
      {
        platform: 'Amazon',
        price: 52999,
        deepLink: 'https://example.com/amazon/iphone13',
        couponCode: 'PHONE10',
        couponLabel: '10% bank offer',
      },
      {
        platform: 'Flipkart',
        price: 48499,
        deepLink: 'https://example.com/flipkart/iphone13',
        couponCode: 'FKSAVE500',
        couponLabel: '₹500 instant discount',
      },
      { platform: 'Tata CLiQ', price: 51999, deepLink: 'https://example.com/tatacliq/iphone13' },
    ],
  },
  {
    id: 'p-boat-airdopes',
    title: 'Boat Airdopes 141',
    category: 'audio',
    keywords: ['boat', 'earbuds', 'airdopes', 'wireless'],
    rating: 4.2,
    reviewCount: '89k',
    image: '🎧',
    bestOfferIndex: 0,
    offers: [
      {
        platform: 'Amazon',
        price: 1299,
        deepLink: 'https://example.com/amazon/boat141',
        couponCode: 'AUDIO5',
        couponLabel: 'Extra 5% off',
      },
      { platform: 'Flipkart', price: 1399, deepLink: 'https://example.com/flipkart/boat141' },
      { platform: 'Myntra', price: 1449, deepLink: 'https://example.com/myntra/boat141' },
    ],
  },
  {
    id: 'p-sony-xm4',
    title: 'Sony WH-1000XM4',
    category: 'audio',
    keywords: ['sony', 'headphones', 'noise', 'xm4'],
    rating: 4.7,
    reviewCount: '42k',
    image: '🎧',
    subtitle: 'Price alert ready',
    bestOfferIndex: 2,
    offers: [
      { platform: 'Amazon', price: 23990, deepLink: 'https://example.com/amazon/xm4' },
      { platform: 'Flipkart', price: 24499, deepLink: 'https://example.com/flipkart/xm4' },
      {
        platform: 'Tata CLiQ',
        price: 22999,
        deepLink: 'https://example.com/tatacliq/xm4',
        couponCode: 'CLIQAUDIO',
        couponLabel: '₹1000 coupon',
      },
    ],
  },
  {
    id: 'p-oneplus-9',
    title: 'OnePlus 9 Pro',
    category: 'mobiles',
    keywords: ['oneplus', '9', 'pro', 'android'],
    rating: 4.3,
    reviewCount: '18k',
    image: '📲',
    bestOfferIndex: 0,
    offers: [
      {
        platform: 'Amazon',
        price: 42999,
        deepLink: 'https://example.com/amazon/op9pro',
        couponCode: 'PLUS2K',
        couponLabel: '₹2000 exchange bonus',
      },
      { platform: 'Flipkart', price: 43999, deepLink: 'https://example.com/flipkart/op9pro' },
    ],
  },
  {
    id: 'p-samsung-s21',
    title: 'Samsung Galaxy S21',
    category: 'mobiles',
    keywords: ['samsung', 'galaxy', 's21', 'android'],
    rating: 4.4,
    reviewCount: '22k',
    image: '📱',
    bestOfferIndex: 1,
    offers: [
      { platform: 'Amazon', price: 46999, deepLink: 'https://example.com/amazon/s21' },
      {
        platform: 'Flipkart',
        price: 44999,
        deepLink: 'https://example.com/flipkart/s21',
        couponCode: 'SAM20',
        couponLabel: '20% off with select cards',
      },
    ],
  },
  {
    id: 'p-watch-xtend',
    title: 'Boat Smartwatch Xtend',
    category: 'wearables',
    keywords: ['boat', 'watch', 'smartwatch', 'xtend'],
    rating: 4.1,
    reviewCount: '54k',
    image: '⌚',
    bestOfferIndex: 0,
    offers: [
      {
        platform: 'Flipkart',
        price: 1799,
        deepLink: 'https://example.com/flipkart/xtend',
        couponCode: 'WEAR15',
        couponLabel: '15% off',
      },
      { platform: 'Amazon', price: 1999, deepLink: 'https://example.com/amazon/xtend' },
      { platform: 'Myntra', price: 2099, deepLink: 'https://example.com/myntra/xtend' },
    ],
  },
  {
    id: 'p-mixer',
    title: 'Philips Mixer Grinder',
    category: 'appliances',
    keywords: ['mixer', 'grinder', 'philips', 'kitchen'],
    rating: 4.0,
    reviewCount: '31k',
    image: '🥤',
    bestOfferIndex: 1,
    offers: [
      { platform: 'Amazon', price: 3299, deepLink: 'https://example.com/amazon/mixer' },
      {
        platform: 'Flipkart',
        price: 2999,
        deepLink: 'https://example.com/flipkart/mixer',
        couponCode: 'HOME100',
        couponLabel: '₹100 off',
      },
    ],
  },
  {
    id: 'p-mi-tv',
    title: 'Mi 43" 4K Smart TV',
    category: 'tv',
    keywords: ['mi', 'xiaomi', 'tv', '4k'],
    rating: 4.5,
    reviewCount: '67k',
    image: '📺',
    bestOfferIndex: 0,
    offers: [
      {
        platform: 'Flipkart',
        price: 25999,
        deepLink: 'https://example.com/flipkart/mitv',
        couponCode: 'TV500',
        couponLabel: '₹500 coupon',
      },
      { platform: 'Amazon', price: 26999, deepLink: 'https://example.com/amazon/mitv' },
    ],
  },
];

export const featuredProductIds = ['p-iphone-13', 'p-boat-airdopes', 'p-mi-tv', 'p-watch-xtend'];

const dealEngagement: Record<string, { likes: string; views: string }> = {
  'p-iphone-13': { likes: '320', views: '5.2K' },
  'p-watch-xtend': { likes: '210', views: '2.5K' },
  'p-mi-tv': { likes: '540', views: '8.1K' },
  'p-boat-airdopes': { likes: '412', views: '6.4K' },
};

function catalogToDeal(p: CatalogProduct): Product {
  const best = p.offers[p.bestOfferIndex];
  const maxP = Math.max(...p.offers.map((o) => o.price));
  const offPct = maxP > best.price ? Math.round(((maxP - best.price) / maxP) * 100) : 0;
  const engagement = dealEngagement[p.id] ?? { likes: '100', views: '1.0K' };
  return {
    id: p.id,
    title: p.title,
    image: p.image,
    price: best.price,
    oldPrice: maxP > best.price ? maxP : undefined,
    discount: offPct > 0 ? `${offPct}%` : undefined,
    likes: engagement.likes,
    views: engagement.views,
    platform: best.platform,
    subtitle: `${best.platform} · ${p.rating} ★`,
  };
}

export const dealsProducts: Product[] = catalog
  .filter((c) => ['p-iphone-13', 'p-watch-xtend', 'p-mi-tv', 'p-boat-airdopes'].includes(c.id))
  .map(catalogToDeal);

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return catalog.find((c) => c.id === id);
}

export function getFeaturedProducts(): CatalogProduct[] {
  return featuredProductIds
    .map((id) => catalog.find((c) => c.id === id))
    .filter((c): c is CatalogProduct => Boolean(c));
}

export function searchCatalog(query: string): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalog.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.category.includes(q) ||
      c.keywords.some((k) => k.includes(q) || q.includes(k)),
  );
}

export function getSimilarProducts(product: CatalogProduct, limit = 6): CatalogProduct[] {
  return catalog
    .filter((c) => c.id !== product.id && (c.category === product.category || c.keywords.some((k) => product.keywords.includes(k))))
    .slice(0, limit);
}

export function lowestPrice(product: CatalogProduct): { price: number; index: number } {
  let min = product.offers[0].price;
  let index = 0;
  product.offers.forEach((o, i) => {
    if (o.price < min) {
      min = o.price;
      index = i;
    }
  });
  return { price: min, index };
}

export const savingsMonthly = [2200, 3100, 6400, 8400];

export const recentSavings: RecentSaving[] = [
  {
    id: 'sav-1',
    title: 'Noise Smartwatch',
    subtitle: 'Ordered via price compare',
    time: 'Yesterday',
    emoji: '⌚',
  },
  {
    id: 'sav-2',
    title: 'Sony Earbuds',
    subtitle: 'Price drop alert — Flipkart',
    time: '2 days ago',
    emoji: '🎧',
  },
  {
    id: 'sav-3',
    title: 'Home Mixer Grinder',
    subtitle: 'Deal + coupon stacked',
    time: '1 week ago',
    emoji: '🥤',
  },
];

export const homeBanners = [
  {
    id: 'banner-1',
    title: 'Mega Smart Sale',
    subtitle: 'Up to 40% off electronics with stacked bank offers',
    cta: 'Explore deals',
    colors: ['#3B82F6', '#6366F1'] as [string, string],
  },
  {
    id: 'banner-2',
    title: 'Weekend Premium Picks',
    subtitle: 'Curated products with reliable ratings and fast delivery',
    cta: 'View picks',
    colors: ['#6366F1', '#3B82F6'] as [string, string],
  },
  {
    id: 'banner-3',
    title: 'Smart Savings Mode',
    subtitle: 'Enable tracking and get instant price-drop alerts',
    cta: 'Track now',
    colors: ['#0EA5E9', '#3B82F6'] as [string, string],
  },
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'audio', label: 'Audio' },
  { id: 'wearables', label: 'Wearables' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'tv', label: 'TV & Home' },
];

export const trendingSearches = ['iPhone 13', 'Sony XM4', 'Smart TV 4K', 'Boat Airdopes', 'OnePlus'];

export const savingsBreakdown = [
  { id: 'bank', label: 'Bank Offers', amount: 7200 },
  { id: 'coupon', label: 'Coupons', amount: 4100 },
  { id: 'drop', label: 'Price Drops', amount: 5150 },
];

export function simulatePriceHistory(basePrice: number) {
  const p1 = Math.round(basePrice * 1.12);
  const p2 = Math.round(basePrice * 1.06);
  const p3 = Math.round(basePrice * 1.04);
  const p4 = basePrice;
  return [p1, p2, p3, p4];
}

export function getPriceStatus(basePrice: number) {
  const history = simulatePriceHistory(basePrice);
  const previous = history[history.length - 2];
  if (basePrice < previous) return 'price dropped';
  if (basePrice > previous) return 'price increased';
  return 'stable';
}
