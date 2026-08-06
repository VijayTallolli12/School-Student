/**
 * StatCard & QuickActionButton — Design System.
 * StatCard: label + big value + optional delta/trend + icon + secondary line.
 * QuickActionButton: colorful tappable grid cell for the dashboard.
 */
import { memo } from "react";
import { View, Text, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "./Motion";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale, elevation } from "@/design-system";

export interface StatCardProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delta?: { label: string; positive: boolean };
  /** Secondary supporting line, e.g. "181 present · 9 absent". */
  subtitle?: string;
  /** Makes the card visually primary (dashboard attendance). */
  emphasized?: boolean;
  style?: ViewStyle;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  icon,
  color,
  delta,
  subtitle,
  emphasized = false,
  style,
}: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: emphasized ? `${color}0A` : colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: emphasized ? `${color}38` : colors.divider,
          padding: spacing.md,
          ...(emphasized ? elevation.raised : elevation.flat),
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.md,
            backgroundColor: `${color}1A`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={19} color={color} />
        </View>
        {delta ? (
          <Text
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: "700",
              color: delta.positive ? colors.success : colors.error,
            }}
          >
            {delta.positive ? "▲" : "▼"} {delta.label}
          </Text>
        ) : null}
      </View>
      <Text
        style={{ ...typeScale.metricSm, color: colors.text, marginTop: spacing.sm }}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, fontWeight: "600", marginTop: 2 }}>
        {label}
      </Text>
      {subtitle ? (
        <Text style={{ fontSize: 11, lineHeight: 15, color: colors.textMuted, fontWeight: "500", marginTop: 2 }} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
});

export interface QuickActionProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
  badge?: number;
  style?: ViewStyle;
}

export const QuickActionButton = memo(function QuickActionButton({
  label,
  icon,
  color,
  onPress,
  badge,
  style,
}: QuickActionProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          flex: 1,
          minHeight: 92,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.divider,
          padding: spacing.md,
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.md,
            backgroundColor: `${color}1A`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={21} color={color} />
        </View>
        {badge && badge > 0 ? (
          <View
            style={{
              minWidth: 20,
              height: 20,
              borderRadius: radius.full,
              backgroundColor: color,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF", lineHeight: 15 }}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text
        style={{
          fontSize: typeScale.bodySmStrong.fontSize,
          fontWeight: "600",
          color: colors.text,
          lineHeight: 18,
          marginTop: spacing.sm,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </PressableScale>
  );
});
