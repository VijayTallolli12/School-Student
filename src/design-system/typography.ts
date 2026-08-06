/**
 * Design System — Typography Tokens
 * Complete scale for a mobile-first consumer app. Supports dynamic type via
 * `fontScale` multiplier (respect device accessibility settings).
 */
import type { TextStyle } from "react-native";

export type FontWeight = TextStyle["fontWeight"];
export type FontFamily = string;

export const fonts = {
  /** Primary family — system font keeps rendering fast & native. */
  sans: "System",
  /** Display usage — system rounded/medium emphasis. */
  display: "System",
  /** Numeric/metric emphasis (streaks, scores). */
  numeric: "System",
} as const;

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  letterSpacing?: number;
  fontFamily?: FontFamily;
}

/** Base scale — 1.0 = default. Multiply when fontScale is applied. */
export const typeScale = {
  /** Large expressive numerals / hero numbers. */
  display: { fontSize: 40, lineHeight: 46, fontWeight: "800", letterSpacing: -1.2 },
  displaySm: { fontSize: 34, lineHeight: 40, fontWeight: "800", letterSpacing: -0.8 },
  headline: { fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.6 },
  headlineSm: { fontSize: 24, lineHeight: 30, fontWeight: "800", letterSpacing: -0.4 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: "700", letterSpacing: -0.3 },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: "700", letterSpacing: -0.2 },
  subtitle: { fontSize: 17, lineHeight: 23, fontWeight: "600", letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400", letterSpacing: 0 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: "600", letterSpacing: 0 },
  bodySm: { fontSize: 13, lineHeight: 19, fontWeight: "400", letterSpacing: 0 },
  bodySmStrong: { fontSize: 13, lineHeight: 19, fontWeight: "600", letterSpacing: 0 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500", letterSpacing: 0.1 },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "700", letterSpacing: 1.2 },
  button: { fontSize: 15, lineHeight: 20, fontWeight: "700", letterSpacing: 0.1 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600", letterSpacing: 0.2 },
  metric: { fontSize: 30, lineHeight: 34, fontWeight: "800", letterSpacing: -0.8 },
  metricSm: { fontSize: 22, lineHeight: 26, fontWeight: "800", letterSpacing: -0.4 },
} as const satisfies Record<string, TypeStyle>;

export type TypeRole = keyof typeof typeScale;

/** Apply a fontScale multiplier (accessibility dynamic type) to a style. */
export function scaled(role: TypeRole, fontScale: number = 1): TextStyle {
  const s: TypeStyle = typeScale[role];
  return {
    fontSize: Math.round(s.fontSize * fontScale),
    lineHeight: Math.round(s.lineHeight * fontScale),
    fontWeight: s.fontWeight,
    letterSpacing: s.letterSpacing,
    fontFamily: s.fontFamily,
  };
}