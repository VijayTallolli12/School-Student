import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Chip, Badge, NotificationCard, EmptyState, ErrorState } from "@/design-system/components";
import { fetchNotifications, markAllNotificationsRead, getErrorMessage } from "@/services/api";
import type { NotificationItem } from "@/types";

const groupByDate = (notifications: NotificationItem[]) => {
  const groups: { label: string; data: NotificationItem[] }[] = [];
  const today: NotificationItem[] = [];
  const yesterday: NotificationItem[] = [];
  const older: NotificationItem[] = [];

  notifications.forEach((n) => {
    const diffDays = Math.floor((Date.now() - new Date(n.created_at).getTime()) / 86400000);
    if (diffDays === 0) today.push(n);
    else if (diffDays === 1) yesterday.push(n);
    else older.push(n);
  });

  if (today.length) groups.push({ label: "Today", data: today });
  if (yesterday.length) groups.push({ label: "Yesterday", data: yesterday });
  if (older.length) groups.push({ label: "Earlier", data: older });
  return groups;
};

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colors } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchNotifications();
      setNotifications(result.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
  }, [load]);

  const handleOpen = useCallback((item: NotificationItem) => {
    if (!item || !item.id) return;
    router.push({
      pathname: "/notifications/[id]",
      params: {
        id: String(item.id),
        title: item.title ?? "",
        body: item.body ?? "",
        type: item.type ?? "general",
        is_read: String(!!item.is_read),
        created_at: item.created_at ?? "",
      },
    });
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;
  const grouped = groupByDate(filtered);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppContainer
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        ),
      }}
    >
      <AppHeader
        title="Notifications"
        showBack
        onBack={() => router.back()}
        right={
          unreadCount > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Pressable onPress={handleMarkAllRead} hitSlop={8} accessibilityRole="button">
                <Text style={{ color: colors.brand, fontSize: 13, fontWeight: "700" }}>Mark all read</Text>
              </Pressable>
              <Badge count={unreadCount} tone="error" />
            </View>
          ) : undefined
        }
      />

      <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg }}>
        <Chip label="All" selected={filter === "all"} onPress={() => setFilter("all")} />
        <Chip label="Unread" selected={filter === "unread"} onPress={() => setFilter("unread")} />
      </View>

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : grouped.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="No Notifications"
          description={filter === "unread" ? "You have no unread notifications" : "No notifications to show"}
        />
      ) : (
        grouped.map((group) => (
          <View key={group.label} style={{ marginBottom: spacing.lg }}>
            <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.sm }}>{group.label}</Text>
            <View style={{ gap: spacing.md }}>
              {group.data.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: radius["2xl"],
                    borderWidth: 1,
                    borderColor: colors.divider,
                    overflow: "hidden",
                  }}
                >
                  <NotificationCard item={item} onPress={() => handleOpen(item)} divider={false} />
                </View>
              ))}
            </View>
          </View>
        ))
      )}
    </AppContainer>
  );
}