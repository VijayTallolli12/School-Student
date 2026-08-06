/**
 * Design System — Opacity Tokens.
 */
export const opacity = {
  /** Disabled elements. */
  disabled: 0.38,
  /** Pressed / active feedback. */
  pressed: 0.12,
  /** Hover (web). */
  hover: 0.06,
  /** Scrim behind modals/sheets. */
  scrim: 0.42,
  /** Strong scrim (full-screen modal). */
  scrimStrong: 0.6,
  /** Focus ring. */
  focusRing: 0.4,
} as const;

/** Semantic background tint factor for icon-on-tinted-circle patterns. */
export const tintBackground = 0.12;