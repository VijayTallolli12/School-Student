import { useCallback, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Tag, EmptyState } from "@/design-system/components";
import { markNotificationRead } from "@/services/api";

const TYPE_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  attendance: { icon: "calendar-outline", label: "Attendance" },
  fees: { icon: "wallet-outline", label: "Fees" },
  result: { icon: "school-outline", label: "Exam Result" },
  homework: { icon: "book-outline", label: "Homework" },
  general: { icon: "megaphone-outline", label: "General" },
};

const TYPE_TONE: Record<string, "info" | "warning" | "neutral"> = {
  attendance: "info",
  fees: "warning",
  result: "info",
  homework: "warning",
  general: "neutral",
};

const TYPE_COLOR: Record<string, keyof ReturnType<typeof useTheme>["colors"]> = {
  attendance: "info",
  fees: "warning",
  result: "success",
  homework: "secondary",
  general: "textSecondary",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " • " + d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationDetailScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const [marked, setMarked] = useState(false);
  const [marking, setMarking] = useState(false);

  const { colors } = useTheme();

  const id = params.id ? Number(params.id) : null;
  const title = params.title ?? "";
  const body = params.body ?? "";
  const type = params.type ?? "general";
  const isRead = params.is_read === "true";
  const createdAt = params.created_at ?? "";

  const meta = TYPE_META[type] ?? TYPE_META.general;
  const tone = TYPE_TONE[type] ?? "neutral";
  const iconColor = colors[TYPE_COLOR[type] ?? "textSecondary"] as string;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/notifications" as Href);
    }
  }, []);

  const handleMarkAsRead = useCallback(async () => {
    if (id === null || marked || isRead) return;
    setMarking(true);
    try {
      await markNotificationRead(id);
      setMarked(true);
    } catch {
      // silently fail - already read or network issue
    } finally {
      setMarking(false);
    }
  }, [id, marked, isRead]);

  if (!id) {
    return (
      <AppContainer>
        <AppHeader title="Notification" showBack onBack={handleBack} />
        <EmptyState
          icon="notifications-off-outline"
          title="Notification Not Found"
          description="This notification could not be loaded"
        />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <AppHeader
        title="Notification"
        showBack
        onBack={handleBack}
        right={
          !isRead && !marked ? (
            <Pressable
              onPress={handleMarkAsRead}
              disabled={marking}
              hitSlop={8}
              accessibilityRole="button"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {marking ? (
                <ActivityIndicator size="small" color={colors.brand} />
              ) : (
                <Text style={{ color: colors.brand, fontSize: 13, fontWeight: "700" }}>Mark Read</Text>
              )}
            </Pressable>
          ) : undefined
        }
      />

      <Card padding="lg" style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.md,
              backgroundColor: `${iconColor}1A`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.md,
            }}
          >
            <Ionicons name={meta.icon} size={24} color={iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.sm }}>
              <Tag label={meta.label} tone={tone} />
              {!isRead && !marked && <Tag label="New" tone="info" />}
              {(isRead || marked) && <Tag label="Read" tone="neutral" />}
            </View>
            <Text style={{ ...typeScale.title, color: colors.text }}>
              {title || "Untitled Notification"}
            </Text>
            <Text style={{ ...typeScale.caption, color: colors.textMuted, marginTop: spacing.sm }}>
              {createdAt ? formatDate(createdAt) : ""}
            </Text>
          </View>
        </View>
      </Card>

      <Card padding="lg" style={{ marginBottom: spacing.lg }}>
        <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.sm }}>
          Message
        </Text>
        <Text style={{ ...typeScale.body, lineHeight: 24, color: colors.text }}>
          {body || "No additional details available for this notification."}
        </Text>
      </Card>
    </AppContainer>
  );
}