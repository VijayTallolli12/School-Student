/**
 * HighlightCard — Design System. Compact dashboard "Today's Highlights" tile.
 * Shows a single piece of contextual info: icon + label + value.
 * Pressable for navigation; supports friendly empty-state styling.
 */
import { memo } from "react";
import { View, Text, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "./Motion";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";

export interface HighlightCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  onPress?: () => void;
  /** Render in muted "empty" style (no data yet). */
  empty?: boolean;
  style?: ViewStyle;
}

export const HighlightCard = memo(function HighlightCard({
  icon,
  label,
  value,
  color,
  onPress,
  empty = false,
  style,
}: HighlightCardProps) {
  const { colors } = useTheme();
  const accent = empty ? colors.textTertiary : color;

  const content = (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.md,
          backgroundColor: `${accent}1A`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text
        style={{
          ...typeScale.bodySmStrong,
          color: empty ? colors.textMuted : colors.text,
          marginTop: spacing.sm,
          lineHeight: 18,
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 11, lineHeight: 15, color: colors.textTertiary, fontWeight: "600", marginTop: 2 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  const base: ViewStyle = {
    flex: 1,
    minHeight: 96,
    backgroundColor: empty ? colors.surfaceSubtle : colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: empty ? colors.divider : colors.divider,
    padding: spacing.md,
    justifyContent: "space-between",
  };

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        style={[base, style]}
      >
        {content}
      </PressableScale>
    );
  }
  return <View style={[base, style]}>{content}</View>;
});
