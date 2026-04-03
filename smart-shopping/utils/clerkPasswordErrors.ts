import { isClerkAPIResponseError } from '@clerk/clerk-expo';

/**
 * Clerk checks passwords against known leaks (HIBP) and can mark passwords compromised.
 * Shown instead of Clerk’s raw copy when those API error codes are returned.
 */
export const BREACHED_PASSWORD_USER_MESSAGE =
  'This password is known from past data leaks. Try another one — a random phrase or password manager works best.';

/** Clerk error codes for leaked / compromised password rejection. */
const PASSWORD_BREACH_CODES = new Set(['form_password_pwned', 'form_password_compromised']);

type ClerkErr = {
  errors?: Array<{ code?: string; longMessage?: string; message?: string }>;
  message?: string;
};

function clerkErrorDetails(e: unknown): { codes: string[]; fullText: string; primaryMessage: string } {
  const err = e as ClerkErr;
  const list = err?.errors ?? [];
  const codes = list.map((x) => String(x?.code ?? ''));
  const parts = list.map((x) => (x?.longMessage ?? x?.message ?? '').trim()).filter(Boolean);
  const primaryMessage = parts[0] ?? (typeof err?.message === 'string' ? err.message : '');
  const fullText = [...parts, typeof err?.message === 'string' ? err.message : ''].join(' ').toLowerCase();
  return { codes, fullText, primaryMessage };
}

/**
 * True only for Clerk API errors with password breach / compromised codes.
 * Avoids substring heuristics (e.g. matching "pwned" in unrelated messages).
 */
export function isClerkBreachedPasswordError(e: unknown): boolean {
  if (!isClerkAPIResponseError(e)) return false;
  return (e.errors ?? []).some((item) => item.code && PASSWORD_BREACH_CODES.has(item.code));
}

/** User-facing Clerk error; breach → friendly message, else first Clerk line or fallback. */
export function normalizeClerkAuthError(e: unknown, fallback: string): string {
  if (isClerkBreachedPasswordError(e)) return BREACHED_PASSWORD_USER_MESSAGE;
  const { primaryMessage } = clerkErrorDetails(e);
  return primaryMessage || fallback;
}
