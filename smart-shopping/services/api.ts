import { API_URL } from '@/constants/env';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string; details?: unknown } | null;
  meta?: Record<string, unknown>;
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

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
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
