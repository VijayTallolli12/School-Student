/**
 * Card — Design System.
 * Variants: elevated, outlined, subtle, sunken. Padding scale from tokens.
 * `pressable` uses PressableScale for tactile feedback.
 */
import { memo } from "react";
import { View, type ViewStyle } from "react-native";
import { PressableScale } from "./Motion";
import { useTheme } from "@/design-system/theme";
import { radius, elevation, spacing } from "@/design-system";

export type CardVariant = "elevated" | "outlined" | "subtle" | "sunken";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  style?: ViewStyle;
}

const PADDING: Record<CardPadding, number> = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
};

export const Card = memo(function Card({
  children,
  variant = "elevated",
  padding = "md",
  onPress,
  style,
}: CardProps) {
  const { colors } = useTheme();

  const bg =
    variant === "elevated" || variant === "outlined"
      ? colors.card
      : variant === "subtle"
        ? colors.surfaceSubtle
        : colors.surfaceSunken;

  const borderColor = variant === "outlined" ? colors.border : colors.divider;

  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor,
    padding: PADDING[padding],
    ...(variant === "elevated" ? elevation.flat : {}),
  };

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        style={[base, style]}
      >
        {children}
      </PressableScale>
    );
  }
  return <View style={[base, style]}>{children}</View>;
});