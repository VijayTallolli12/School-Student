/**
 * Responsive utilities — Design System.
 * Window-aware hooks for adaptive layout across phone → tablet → desktop.
 * Centered around the existing `breakpoints` token (400 / 640 / 960).
 */
import { useWindowDimensions } from "react-native";
import { breakpoints } from "./breakpoints";

export type BreakpointName = "phone" | "phoneLg" | "tablet" | "desktop";

/** Column-count default per breakpoint (used when no map is supplied). */
export const DEFAULT_COLUMNS: Record<BreakpointName, number> = {
  phone: 2,
  phoneLg: 2,
  tablet: 3,
  desktop: 4,
};

export interface ScreenInfo {
  width: number;
  height: number;
  /** Device accessibility fontScale (≥ 1 when user enlarges text). */
  fontScale: number;
  isLandscape: boolean;
  isSmallPhone: boolean;
  isTablet: boolean;
  breakpoint: BreakpointName;
}

export function resolveBreakpoint(width: number): BreakpointName {
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.tablet) return "tablet";
  if (width >= breakpoints.phoneLg) return "phoneLg";
  return "phone";
}

export function useScreenSize(): ScreenInfo {
  const { width, height, fontScale } = useWindowDimensions();
  return {
    width,
    height,
    fontScale: fontScale || 1,
    isLandscape: width > height,
    isSmallPhone: width < 380,
    isTablet: width >= breakpoints.tablet,
    breakpoint: resolveBreakpoint(width),
  };
}

/**
 * Adaptive column count for the current window width.
 * @param map per-breakpoint column counts; defaults to `DEFAULT_COLUMNS`.
 * @param fallback used when the mapped breakpoint has no value.
 */
export function useAdaptiveColumns(
  map?: Partial<Record<BreakpointName, number>>,
  fallback = 2,
): number {
  const { breakpoint } = useScreenSize();
  const columns = map?.[breakpoint] ?? fallback;
  return columns;
}

/**
 * Per-breakpoint spacer helper for responsive gutters.
 */
export const responsiveGap = {
  phone: 12,
  phoneLg: 12,
  tablet: 16,
  desktop: 20,
} as const;

/** Max usable content width on large screens (avoids stretched rows on tablets). */
export const MAX_CONTENT_WIDTH = 720;