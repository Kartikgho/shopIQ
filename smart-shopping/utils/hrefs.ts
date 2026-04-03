import type { Href } from 'expo-router';

export function hrefCompare(productId: string): Href {
  return `/compare/${productId}` as Href;
}

/** Signed-in home (tabs). */
export const hrefHome: Href = '/(tabs)/home' as Href;

export const hrefPremiumSavings: Href = '/premium-savings' as Href;

/** Wishlist tab */
export const hrefSaved: Href = '/saved' as Href;

/** Clerk auth (Expo Router group) */
export const hrefSignIn: Href = '/(auth)/sign-in' as Href;
export const hrefSignUp: Href = '/(auth)/sign-up' as Href;
