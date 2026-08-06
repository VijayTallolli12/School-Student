/**
 * Design System — Color Tokens
 * Palette: "Iris" (violet-indigo brand), "Mint" (secondary),
 * "Sunset" (accent), cool-violet neutrals called "Basalt".
 * Build for energy + professionalism; color-blind-aware (hue + lightness pairs).
 */
export const palette = {
  brand: {
    50: "#F4F1FF",
    100: "#E9E3FF",
    200: "#D7C8FF",
    300: "#B7A2FF",
    400: "#9777FF",
    500: "#7C4DFF",
    600: "#6A3AE8",
    700: "#582BCB",
    800: "#4824A3",
    900: "#3B1F7E",
    950: "#25124D",
  },
  secondary: {
    50: "#EFFCF7",
    100: "#D7F7EC",
    200: "#B1EEDB",
    300: "#7FE0C4",
    400: "#4CCAA9",
    500: "#2DB392",
    600: "#1E977A",
    700: "#1A7A63",
    800: "#186150",
    900: "#134D42",
  },
  accent: {
    50: "#FFF3EC",
    100: "#FFE2D2",
    200: "#FFC2A3",
    300: "#FF9C70",
    400: "#FF7A45",
    500: "#FB5E1D",
    600: "#EC4A0F",
    700: "#C43A10",
    800: "#9C3014",
    900: "#7E2A15",
  },
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
  },
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },
  error: {
    50: "#FFF1F2",
    100: "#FDE3E6",
    200: "#FBC6CE",
    300: "#F79AA8",
    400: "#F15E76",
    500: "#EF3D5B",
    600: "#E11D48",
    700: "#BE123C",
  },
  info: {
    50: "#ECFEFF",
    100: "#CFFAFE",
    200: "#A5F3FC",
    300: "#67E8F9",
    400: "#22D3EE",
    500: "#06B6D4",
    600: "#0891B2",
    700: "#0E7490",
  },
  /** Cool violet-tinted neutrals — "Basalt". */
  neutral: {
    0: "#FFFFFF",
    50: "#F7F6FC",
    100: "#F0EEF9",
    150: "#E9E7F5",
    200: "#E0DEF0",
    300: "#C7C4DD",
    400: "#A5A2BC",
    500: "#7E7B96",
    600: "#5E5B78",
    700: "#413F5C",
    800: "#2C2A45",
    900: "#1B1830",
    950: "#131022",
  },
  /** Light theme surfaces. */
  surface: {
    background: "#F7F6FC",
    card: "#FFFFFF",
    subtle: "#F0EEF7",
    sunken: "#E9E7F5",
    elevated: "#FFFFFF",
    border: "#E4E2F0",
    divider: "#EEECF7",
  },
  /** Dark theme (true dark surfaces). */
  dark: {
    background: "#100E1E",
    card: "#1B1830",
    subtle: "#221F3C",
    sunken: "#17142A",
    elevated: "#252143",
    border: "#2C2946",
    divider: "#241F3C",
  },
} as const;

/** Text color roles — resolve from a theme variant. */
export const TextColor = {
  primary: "#1B1830",
  secondary: "#5C5B78",
  muted: "#A5A2BC",
  tertiary: "#9E9BB8",
  disabled: "#CDCBE0",
  inverse: "#FFFFFF",
  onBrand: "#FFFFFF",
} as const;

export type BrandColorName = keyof typeof palette.brand;
export type SemanticColor = "success" | "warning" | "error" | "info";
export type SemanticScale = Record<SemanticColor, number>;