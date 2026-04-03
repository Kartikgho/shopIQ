const required = (value: string | undefined, fallback: string) => value ?? fallback;

export const APP_NAME = required(process.env.EXPO_PUBLIC_APP_NAME, 'SmartShoppingAI');
export const API_URL = required(process.env.EXPO_PUBLIC_API_URL, 'https://api.example.com');
export const FIREBASE_API_KEY = required(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, 'your_key');
/** Appended to shared URLs for affiliate / attribution tracking */
export const AFFILIATE_REF = required(process.env.EXPO_PUBLIC_AFFILIATE_REF, 'smartshop_app');
