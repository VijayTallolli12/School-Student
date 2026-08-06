// Legacy theme module — now sourced from the Design System.
// Kept for backward compatibility; new code should import from "@/design-system".
import { palette } from "@/design-system/colors";

export const theme = {
  colors: palette,
  typography: {},
  spacing: {},
  radii: {},
  shadows: {},
} as const;