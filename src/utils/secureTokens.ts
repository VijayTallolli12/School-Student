import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/constants/config";
import { storage } from "@/utils/storage";

export interface TokenBundle {
  accessToken: string;
  refreshToken?: string | null;
  tokenType?: string;
  expiresInSeconds?: number;
  expiresAtMs?: number;
}

let secureStoreAvailable: boolean | null = null;

async function canUseSecureStore(): Promise<boolean> {
  if (secureStoreAvailable != null) return secureStoreAvailable;
  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }
  return secureStoreAvailable;
}

async function setSecret(key: string, value: string): Promise<void> {
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  await storage.set(key, value);
}

async function getSecret(key: string): Promise<string | null> {
  if (await canUseSecureStore()) {
    return SecureStore.getItemAsync(key);
  }
  return storage.get<string>(key);
}

async function removeSecret(key: string): Promise<void> {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await storage.remove(key);
}

export async function persistTokens(bundle: TokenBundle): Promise<void> {
  await setSecret(STORAGE_KEYS.ACCESS_TOKEN, bundle.accessToken);
  await setSecret(STORAGE_KEYS.AUTH_TOKEN, bundle.accessToken);

  if (bundle.refreshToken) {
    await setSecret(STORAGE_KEYS.REFRESH_TOKEN, bundle.refreshToken);
  }

  if (bundle.tokenType) {
    await setSecret(STORAGE_KEYS.TOKEN_TYPE, bundle.tokenType);
  }

  const expiresAt =
    bundle.expiresAtMs ??
    (typeof bundle.expiresInSeconds === "number"
      ? Date.now() + Math.max(0, bundle.expiresInSeconds) * 1000
      : null);

  if (expiresAt != null) {
    await setSecret(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));
  }
}

export async function getAccessToken(): Promise<string | null> {
  const token = await getSecret(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) return token;
  return getSecret(STORAGE_KEYS.AUTH_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return getSecret(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function getTokenType(): Promise<string | null> {
  return getSecret(STORAGE_KEYS.TOKEN_TYPE);
}

export async function getTokenExpiryMs(): Promise<number | null> {
  const raw = await getSecret(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function isAccessTokenExpired(graceSeconds = 30): Promise<boolean> {
  const expiresAt = await getTokenExpiryMs();
  if (expiresAt == null) return false;
  return Date.now() + graceSeconds * 1000 >= expiresAt;
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    removeSecret(STORAGE_KEYS.ACCESS_TOKEN),
    removeSecret(STORAGE_KEYS.REFRESH_TOKEN),
    removeSecret(STORAGE_KEYS.TOKEN_TYPE),
    removeSecret(STORAGE_KEYS.TOKEN_EXPIRES_AT),
    removeSecret(STORAGE_KEYS.AUTH_TOKEN),
  ]);
}
