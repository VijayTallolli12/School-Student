/**
 * Design System — Spacing Tokens (4px base grid).
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 56,
  "7xl": 64,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Named layout gutter used by AppContainer/Screen. */
export const layout = {
  gutter: 20,
  gutterSm: 16,
  section: 24,
  cardGap: 12,
  gridGap: 10,
} as const;

export function space(token: SpacingToken | number): number {
  return typeof token === "number" ? token : spacing[token];
}