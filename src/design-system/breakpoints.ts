/**
 * Design System — Breakpoint Tokens.
 * Window width breakpoints for responsive layouts (phone → tablet).
 */
export const breakpoints = {
  phone: 0,
  phoneLg: 400,
  tablet: 640,
  desktop: 960,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** Convenience: number[] for width-based breakpoint lookups. */
export const breakpointValues = Object.values(breakpoints).sort((a, b) => a - b);