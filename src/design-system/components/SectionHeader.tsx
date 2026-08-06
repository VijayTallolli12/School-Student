/**
 * SectionHeader — Design System.
 * Title + optional subtitle + optional trailing action link.
 */
import { memo } from "react";
import { View, Text, Pressable, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, typeScale } from "@/design-system";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const SectionHeader = memo(function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const titleStyle = {
    ...typeScale.subtitle,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  };
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-end", marginBottom: spacing.lg },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: titleStyle.fontSize,
            lineHeight: titleStyle.lineHeight,
            fontWeight: titleStyle.fontWeight,
            letterSpacing: titleStyle.letterSpacing,
            color: colors.text,
          }}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: colors.textMuted,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
          style={{ flexDirection: "row", alignItems: "center", paddingLeft: spacing.md, height: 32 }}
        >
          <Text
            style={{ fontSize: 13, fontWeight: "700", color: colors.brand, lineHeight: 18 }}
          >
            {actionLabel}
          </Text>
          <Ionicons name="chevron-forward" size={15} color={colors.brand} style={{ marginLeft: 2 }} />
        </Pressable>
      ) : null}
    </View>
  );
});