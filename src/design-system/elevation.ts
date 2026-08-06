/**
 * Design System — Elevation & Shadow Tokens.
 * Cross-platform: iOS shadow props + Android elevation.
 * `colored` variants tint the shadow with the color when available.
 */
import type { ViewStyle } from "react-native";

export type ElevationStyle = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const elevation: Record<"none" | "flat" | "raised" | "overlay", ElevationStyle> = {
  none: {},
  flat: {
    shadowColor: "#131022",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  raised: {
    shadowColor: "#131022",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  overlay: {
    shadowColor: "#131022",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

/** Colored glow for primary/energy elements (used sparingly). */
export function coloredShadow(color: string, intensity = 0.28): ElevationStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: intensity,
    shadowRadius: 12,
    elevation: 4,
  };
}