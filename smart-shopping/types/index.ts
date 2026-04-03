export type PlatformOffer = {
  platform: string;
  price: number;
  deepLink: string;
  couponCode?: string;
  couponLabel?: string;
};

export type CatalogProduct = {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  rating: number;
  reviewCount: string;
  image: string;
  offers: PlatformOffer[];
  /** Index into offers — best overall (price + coupon heuristic) */
  bestOfferIndex: number;
  subtitle?: string;
};

/** Legacy card shape for deals list UI */
export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  likes?: string;
  views?: string;
  platform?: string;
};

export type RecentSaving = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  emoji: string;
};

export type DealReaction = 'like' | 'fire';
