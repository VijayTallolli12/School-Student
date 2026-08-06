/**
 * Badge & Tag — Design System.
 * Badge: compact count. Tag: inline status label.
 */
import { memo } from "react";
import { View, Text, type ViewStyle } from "react-native";
import { useTheme, type Theme } from "@/design-system/theme";
import { radius, spacing } from "@/design-system";

type Tone = "brand" | "success" | "warning" | "error" | "info" | "neutral";

function tonePair(colors: Theme["colors"], tone: Tone): [string, string] {
  switch (tone) {
    case "brand": return [colors.brand, `${colors.brand}1A`];
    case "success": return [colors.success, `${colors.success}1A`];
    case "warning": return [colors.warning, `${colors.warning}1A`];
    case "error": return [colors.error, `${colors.error}1A`];
    case "info": return [colors.info, `${colors.info}1A`];
    default: return [colors.textSecondary, `${colors.textSecondary}1A`];
  }
}

/** Compact count badge (unread notifications, etc.). */
export interface BadgeProps {
  count: number;
  tone?: Tone;
  max?: number;
  style?: ViewStyle;
}

export const Badge = memo(function Badge({ count, tone = "error", max = 99, style }: BadgeProps) {
  const { colors } = useTheme();
  if (count <= 0) return null;
  const [fg, bg] = tonePair(colors, tone);
  return (
    <View
      style={[
        {
          minWidth: 18,
          height: 18,
          borderRadius: radius.full,
          backgroundColor: bg,
          borderColor: fg,
          borderWidth: 1,
          paddingHorizontal: spacing.xs,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 10, fontWeight: "700", color: fg, lineHeight: 14 }}>
        {count > max ? `${max}+` : count}
      </Text>
    </View>
  );
});

/** Inline status tag. */
export interface TagProps {
  label: string;
  tone?: Tone;
}

export const Tag = memo(function Tag({ label, tone = "neutral" }: TagProps) {
  const { colors } = useTheme();
  const [fg, bg] = tonePair(colors, tone);
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: spacing.sm + 2,
        height: 24,
        borderRadius: radius.full,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "700", color: fg, lineHeight: 16 }}>{label}</Text>
    </View>
  );
});

export type { Tone };