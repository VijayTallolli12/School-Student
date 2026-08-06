/**
 * Design System — Theme Core.
 * Assembles color tokens into Light / Dark themes and exposes a `useTheme`
 * hook that merges runtime school branding (from the branding store) with the
 * system color scheme. This is the single source of truth for all colors.
 */
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useBrandingStore } from "@/store/branding.store";
import { palette, TextColor } from "./colors";

export type ThemeMode = "light" | "dark";

export interface Theme {
  mode: ThemeMode;
  /** True when a brand override color is active (school theming). */
  hasBrand: boolean;
  colors: {
    brand: string;
    brandDeep: string;
    brandMuted: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    card: string;
    surfaceSubtle: string;
    surfaceSunken: string;
    elevated: string;
    border: string;
    divider: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textTertiary: string;
    textDisabled: string;
    inverse: string;
    onBrand: string;
    overlay: string;
  };
}

export function createTheme(
  mode: ThemeMode,
  brandOverride?: string,
  secondaryOverride?: string,
): Theme {
  const isDark = mode === "dark";
  const c = palette;
  const text = isDark
    ? { primary: "#F3F1FF", secondary: "#A9A6C2", muted: "#75738F", tertiary: "#5B5878", disabled: "#4C4968" }
    : TextColor;

  // If a school override exists use it; otherwise fall back to brand scale.
  const brand = brandOverride || c.brand[500];

  return {
    mode,
    hasBrand: !!brandOverride,
    colors: {
      brand,
      brandDeep: brandOverride || c.brand[700],
      brandMuted: brand,
      secondary: secondaryOverride || c.secondary[500],
      accent: c.accent[500],
      success: c.success[500],
      warning: c.warning[500],
      error: c.error[500],
      info: c.info[500],
      background: isDark ? c.dark.background : c.surface.background,
      card: isDark ? c.dark.card : c.surface.card,
      surfaceSubtle: isDark ? c.dark.subtle : c.surface.subtle,
      surfaceSunken: isDark ? c.dark.sunken : c.surface.sunken,
      elevated: isDark ? c.dark.elevated : c.surface.elevated,
      border: isDark ? c.dark.border : c.surface.border,
      divider: isDark ? c.dark.divider : c.surface.divider,
      text: text.primary,
      textSecondary: text.secondary,
      textMuted: text.muted,
      textTertiary: text.tertiary,
      textDisabled: text.disabled,
      inverse: "#FFFFFF",
      onBrand: "#FFFFFF",
      overlay: isDark ? "rgba(0,0,0,0.6)" : "rgba(19,16,34,0.42)",
    },
  };
}

/** Light theme with brand scale defaults. */
export const lightTheme = createTheme("light");
/** Dark theme with brand scale defaults. */
export const darkTheme = createTheme("dark");

/**
 * Runtime hook — returns a Theme merged from system color scheme + branding.
 * Components should call `useTheme()`; never hardcode colors.
 */
export function useTheme(): Theme {
  const systemMode = useColorScheme();
  const theme = useBrandingStore((s) => s.theme);
  const mode: ThemeMode = systemMode === "dark" ? "dark" : "light";
  return useMemo(
    () => createTheme(mode, theme?.primary, theme?.secondary),
    [mode, theme],
  );
}