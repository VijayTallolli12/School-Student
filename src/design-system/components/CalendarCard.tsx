/**
 * CalendarEventCard & AchievementCard — Design System.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import type { CalendarEvent } from "@/types";

const typeColorMap: Record<string, string> = {
  holiday: "success",
  exam: "error",
  ptm: "warning",
  sports: "secondary",
  annual: "brand",
  event: "info",
};

const typeIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  holiday: "sunny-outline",
  exam: "create-outline",
  ptm: "people-outline",
  sports: "basketball-outline",
  annual: "sparkles-outline",
  event: "calendar-outline",
};

export const CalendarEventCard = memo(function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const { colors } = useTheme();
  const key = (event.event_type ?? "event").toLowerCase();
  const color = (colors[typeColorMap[key] as keyof typeof colors] ?? colors.info) as string;
  const icon = typeIconMap[key] ?? "calendar-outline";
  const d = new Date(event.start_date + "T00:00:00");

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.md,
      }}
    >
      <View
        style={{
          width: 52,
          borderRadius: radius.md,
          backgroundColor: `${color}14`,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing.sm,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "700", color, lineHeight: 16, textTransform: "uppercase" }}>
          {d.toLocaleDateString("en-IN", { month: "short" })}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "800", color, lineHeight: 24 }}>{d.getDate()}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
          {event.title}
        </Text>
        {event.description ? (
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 1 }} numberOfLines={1}>
            {event.description}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.sm }}>
          <Ionicons name={icon} size={13} color={color} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color,
              marginLeft: 4,
              lineHeight: 16,
              textTransform: "capitalize",
            }}
          >
            {event.event_type}
          </Text>
          {event.location ? (
            <Text style={{ fontSize: 12, color: colors.textTertiary, marginLeft: spacing.md, lineHeight: 16 }} numberOfLines={1}>
              @ {event.location}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
});

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const AchievementCard = memo(function AchievementCard({ achievement }: { achievement: AchievementItem }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.md,
        alignItems: "center",
        width: 110,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.full,
          backgroundColor: `${achievement.color}1A`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={achievement.icon} size={22} color={achievement.color} />
      </View>
      <Text
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
          marginTop: spacing.sm,
        }}
        numberOfLines={2}
      >
        {achievement.title}
      </Text>
      <Text
        style={{ fontSize: 11, lineHeight: 15, color: colors.textTertiary, textAlign: "center", marginTop: 1 }}
        numberOfLines={2}
      >
        {achievement.subtitle}
      </Text>
    </View>
  );
});