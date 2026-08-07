/**
 * Button — Design System.
 * Variants: primary, secondary, outlined, ghost. Sizes: sm, md, lg.
 * Optional leading icon, loading, press-scale via PressableScale.
 */
import { memo } from "react";
import { ActivityIndicator, Text, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "./Motion";
import { useTheme } from "@/design-system/theme";
import { radius, spacing } from "@/design-system";

export type ButtonVariant = "primary" | "secondary" | "outlined" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const SIZES: Record<ButtonSize, { h: number; px: number; fontSize: number }> = {
  sm: { h: 44, px: spacing.lg, fontSize: 14 },
  md: { h: 48, px: spacing.xl, fontSize: 15 },
  lg: { h: 54, px: spacing["2xl"], fontSize: 16 },
};

export const Button = memo(function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const s = SIZES[size];

  const filled = variant === "primary" || variant === "secondary";
  const bg = variant === "primary" ? colors.brand : variant === "secondary" ? colors.brandDeep : "transparent";
  const fg = filled ? "#FFFFFF" : variant === "ghost" ? colors.brand : colors.brandDeep;
  const iconColor = isDisabled && filled ? "rgba(255,255,255,0.6)" : fg;
  const iconSize = size === "lg" ? 20 : 18;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      noScale={isDisabled}
      style={[
        {
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: radius.md,
          backgroundColor: bg,
          borderWidth: variant === "outlined" ? 1.5 : 0,
          borderColor: variant === "outlined" ? colors.brand : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.38 : 1,
        },
        fullWidth ? { width: "100%" } : {},
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={filled ? "#FFFFFF" : colors.brand} size="small" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={{ marginRight: 8 }} />
          )}
          <Text
            style={{
              fontSize: s.fontSize,
              fontWeight: "700",
              lineHeight: s.fontSize + 4,
              color: isDisabled && filled ? "rgba(255,255,255,0.6)" : fg,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </PressableScale>
  );
});