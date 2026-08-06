/**
 * Design System — Radius Tokens.
 * Friendly, rounded corners — never harsh.
 */
export const radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  "2xl": 32,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;

/** Roundness presets for common containers. */
export const radiusPresets = {
  button: radius.md,
  card: radius.lg,
  hero: radius["2xl"],
  chip: radius.full,
  input: radius.md,
  sheet: radius["2xl"],
} as const;