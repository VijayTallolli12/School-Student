/**
 * HomeworkCard — Design System. Homework assignment list item.
 */
import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import type { HomeworkItem } from "@/types";

function daysUntil(due: string): number {
  const d = new Date(due + "T23:59:59").getTime() - Date.now();
  return Math.ceil(d / 86400000);
}

export const HomeworkCard = memo(function HomeworkCard({
  item,
  onPress,
}: {
  item: HomeworkItem;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const days = daysUntil(item.due_date);
  const overdue = days < 0;
  const dueSoon = days >= 0 && days <= 1;
  const badgeC = overdue ? colors.error : dueSoon ? colors.warning : colors.info;
  const badgeText = overdue ? `Overdue by ${Math.abs(days)}d` : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due in ${days}d`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`Homework: ${item.title}`}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.md,
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: `${colors.info}1A`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="book" size={20} color={colors.info} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
            {item.subject_name ?? "Homework"}
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 19, color: colors.textSecondary, marginTop: 2 }} numberOfLines={2}>
            {item.title || item.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.sm }}>
            <Ionicons name="time-outline" size={13} color={badgeC} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: badgeC, marginLeft: 4, lineHeight: 16 }}>{badgeText}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});