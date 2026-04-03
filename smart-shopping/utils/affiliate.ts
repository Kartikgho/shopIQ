import { AFFILIATE_REF } from '@/constants/env';

export function withAffiliateParams(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('ref', AFFILIATE_REF);
    u.searchParams.set('utm_source', 'smartshopping_app');
    return u.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}ref=${encodeURIComponent(AFFILIATE_REF)}&utm_source=smartshopping_app`;
  }
}
