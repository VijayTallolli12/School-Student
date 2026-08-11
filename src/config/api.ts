const API_SUFFIX = "api/v1";

function normalizeApiUrl(raw: string | undefined): string {
  const trimmed = raw?.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://192.168.1.3:8000/api/v1";
  return trimmed.endsWith(`/${API_SUFFIX}`) ? trimmed : `${trimmed}/${API_SUFFIX}`;
}

const primaryApiUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);
const fallbackApiUrl = "https://school-erp-production-e3a5.up.railway.app/api/v1";

export const API_BASE_URL = primaryApiUrl;

console.log("[API Config] Primary API URL:", primaryApiUrl);
console.log("[API Config] Fallback API URL:", fallbackApiUrl);

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getFallbackApiBaseUrl(): string {
  return fallbackApiUrl;
}
