/**
 * EmptyState — Design System. Friendly, illustrated, action-ready.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: "sm" | "md";
  /** Playful accessory emoji (e.g. "📚") rendered under the icon. */
  emoji?: string;
}

export const EmptyState = memo(function EmptyState({
  icon = "sparkles",
  title,
  description,
  actionLabel,
  onAction,
  size = "md",
  emoji,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const dim = size === "md" ? 84 : 64;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: size === "md" ? spacing["4xl"] : spacing["3xl"],
        paddingHorizontal: spacing["2xl"],
      }}
    >
      <View
        style={{
          width: dim,
          height: dim,
          borderRadius: radius.full,
          backgroundColor: `${colors.brand}14`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={size === "md" ? 36 : 28} color={colors.brand} />
      </View>
      {emoji ? (
        <Text style={{ fontSize: 28, marginTop: spacing.md, lineHeight: 34 }} accessibilityElementsHidden>
          {emoji}
        </Text>
      ) : null}
      <Text
        accessibilityRole="header"
        style={{
          ...typeScale.subtitle,
          color: colors.text,
          marginTop: emoji ? spacing.xs : spacing.lg,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            fontSize: typeScale.bodySm.fontSize,
            lineHeight: typeScale.bodySm.lineHeight,
            color: colors.textSecondary,
            textAlign: "center",
            marginTop: spacing.sm,
            maxWidth: 280,
          }}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing["2xl"], width: "80%" }}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
            size="sm"
            fullWidth
          />
        </View>
      ) : null}
    </View>
  );
});