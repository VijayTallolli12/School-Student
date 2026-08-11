const API_SUFFIX = "api/v1";

function normalizeApiUrl(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  return trimmed.endsWith(`/${API_SUFFIX}`) ? trimmed : `${trimmed}/${API_SUFFIX}`;
}

function resolveUrl(raw: string | undefined, label: string): string | undefined {
  const url = normalizeApiUrl(raw);
  if (url) {
    console.log(`[API Config] ${label}:`, url);
  } else {
    console.warn(`[API Config] ${label}: NOT configured`);
  }
  return url;
}

const primaryApiUrl = resolveUrl(process.env.EXPO_PUBLIC_API_URL, "Primary API URL");
const fallbackApiUrl = resolveUrl(process.env.EXPO_PUBLIC_FALLBACK_API_URL, "Fallback API URL");

if (!primaryApiUrl) {
  throw new Error(
    "[API Config] EXPO_PUBLIC_API_URL is not set. Configure it in .env.development (local dev), " +
      ".env.production (production), or the eas.json build profile env before starting the app.",
  );
}

export const API_BASE_URL = primaryApiUrl;

console.log("[API Config] Fallback API mechanism:", fallbackApiUrl ? "enabled" : "disabled (not configured)");

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getFallbackApiBaseUrl(): string | undefined {
  return fallbackApiUrl;
}

export function isFallbackApiConfigured(): boolean {
  return Boolean(fallbackApiUrl);
}
