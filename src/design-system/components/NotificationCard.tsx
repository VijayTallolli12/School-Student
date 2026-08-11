/**
 * NotificationCard & AnnouncementCard — Design System. List items for
 * notifications and announcements with read/unread styling.
 */
import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import type { NotificationItem, AnnouncementItem } from "@/types";

const typeIcon: Record<NotificationItem["type"], keyof typeof Ionicons.glyphMap> = {
  general: "notifications-outline",
  attendance: "calendar-outline",
  fees: "wallet-outline",
  homework: "book-outline",
  result: "ribbon-outline",
};

const typeColor: Record<NotificationItem["type"], string> = {
  general: "info",
  attendance: "brand",
  fees: "warning",
  homework: "secondary",
  result: "success",
};

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export const NotificationCard = memo(function NotificationCard({
  item,
  onPress,
  divider = true,
}: {
  item: NotificationItem;
  onPress?: () => void;
  divider?: boolean;
}) {
  const { colors } = useTheme();
  const colorKey = typeColor[item.type] ?? "info";
  const color = colors[colorKey as keyof typeof colors] as string;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={item.title}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: item.is_read ? colors.card : `${color}0A`,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: colors.divider,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          backgroundColor: `${color}1A`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={typeIcon[item.type] ?? "notifications-outline"} size={20} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 20,
              fontWeight: item.is_read ? "600" : "800",
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.is_read ? (
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginLeft: spacing.sm }} />
          ) : null}
        </View>
        <Text
          style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 2 }}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 15, color: colors.textTertiary, marginTop: 4, fontWeight: "500" }}>
          {timeAgo(item.created_at)}
        </Text>
      </View>
    </Pressable>
  );
});

export const AnnouncementCard = memo(function AnnouncementCard({
  item,
  onPress,
}: {
  item: AnnouncementItem;
  onPress?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={item.title}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: item.is_read ? colors.divider : colors.brand,
        padding: spacing.lg,
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.sm,
            backgroundColor: `${colors.brand}1A`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="megaphone" size={18} color={colors.brand} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                flex: 1,
                ...typeScale.bodyStrong,
                color: colors.text,
                fontWeight: item.is_read ? "600" : "800",
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.is_read ? (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginLeft: spacing.sm }} />
            ) : null}
          </View>
          <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, marginTop: 2, fontWeight: "500" }}>
            {item.type_label ?? "Announcement"} · {timeAgo(item.sent_at ?? item.created_at)}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: spacing.md }} numberOfLines={2}>
        {item.body || item.message}
      </Text>
    </Pressable>
  );
});