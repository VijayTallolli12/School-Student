/**
 * Design System — Safe Area Tokens.
 * Default gutter padding for content inside safe areas (used by AppContainer).
 */
export const safeArea = {
  /** Horizontal content gutter that respects home-indicator alcoves. */
  horizontal: 20,
  /** Minimum vertical buffer under notches / status bars. */
  top: 12,
  bottom: 12,
} as const;