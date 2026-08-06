/**
 * Text — Design System primitive.
 * Typed text with token-driven role + color. Respects accessibility font scaling.
 */
import { memo } from "react";
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { scaled, type TypeRole } from "@/design-system/typography";
import { useTheme } from "@/design-system/theme";

export interface TextProps extends Omit<RNTextProps, "style" | "role"> {
  role?: TypeRole;
  /** Text color role. */
  color?: "text" | "secondary" | "muted" | "disabled" | "inverse" | "brand" | "success" | "warning" | "error" | "info";
  style?: TextStyle | TextStyle[];
}

type ColorMap = Record<NonNullable<TextProps["color"]>, string>;

export const DesignText = memo(function DesignText({
  role = "body",
  color = "text",
  style,
  ...rest
}: TextProps) {
  const { colors } = useTheme();
  const colorMap: ColorMap = {
    text: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    disabled: colors.textDisabled,
    inverse: colors.inverse,
    brand: colors.brand,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  };
  const base = scaled(role);
  const extra = (Array.isArray(style) ? style : [style]).filter(Boolean) as TextStyle[];
  return <RNText {...rest} style={[{ ...base, color: colorMap[color] }, ...extra]} />;
});