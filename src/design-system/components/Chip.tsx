/**
 * Chip — Design System. Compact selectable/filter pill.
 */
import { memo } from "react";
import { View, Text, Pressable, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { radius, spacing } from "@/design-system";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const Chip = memo(function Chip({ label, selected = false, onPress, icon, style }: ChipProps) {
  const { colors } = useTheme();
  const selectedStyle = {
    backgroundColor: selected ? colors.brand : colors.surfaceSubtle,
    borderColor: selected ? colors.brand : colors.border,
  };
  const fg = selected ? colors.onBrand : colors.textSecondary;

  const content = (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.md,
          height: 34,
          borderRadius: radius.full,
          borderWidth: 1.5,
          ...selectedStyle,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={15} color={fg} style={{ marginRight: 6 }} />
      )}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: fg,
          lineHeight: 18,
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={6}
    >
      {content}
    </Pressable>
  );
});