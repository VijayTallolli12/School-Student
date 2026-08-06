import { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Tag, EmptyState } from "@/design-system/components";
import { fetchCircularDetail, markCircularRead } from "@/services/api";
import type { CircularItem } from "@/types";

const PRIORITY_LABEL: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

const PRIORITY_TONE: Record<string, "error" | "warning" | "neutral" | "info"> = {
  urgent: "error",
  high: "warning",
  normal: "neutral",
  low: "info",
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

export default function CircularDetailScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CircularItem | null>(null);

  const { colors } = useTheme();

  const id = params.id ? Number(params.id) : null;
  const title = params.title ?? "";
  const body = params.body ?? "";
  const priority = params.priority ?? "normal";
  const createdAt = params.created_at ?? "";
  const createdBy = params.created_by ? JSON.parse(params.created_by) : null;
  const isRead = params.is_read === "true";

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCircularDetail(id);
        setDetail(data);
      } catch {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const handleMarkRead = useCallback(async () => {
    if (!id || isRead) return;
    try {
      await markCircularRead(id);
    } catch {
      // silently fail
    }
  }, [id, isRead]);

  useEffect(() => {
    handleMarkRead();
  }, [handleMarkRead]);

  const circTitle = detail?.title ?? title;
  const circBody = detail?.body ?? detail?.message ?? body;

  if (!id) {
    return (
      <AppContainer>
        <AppHeader title="Circular" showBack onBack={() => router.back()} />
        <EmptyState
          icon="megaphone-outline"
          title="Circular Not Found"
          description="This circular could not be loaded"
        />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <AppHeader title="Circular" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading...</Text>
        </View>
      ) : (
        <>
          <Card padding="lg" style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.md,
                  backgroundColor: `${colors.brand}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Ionicons name="megaphone-outline" size={24} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.sm }}>
                  <Tag label={PRIORITY_LABEL[priority] ?? "Normal"} tone={PRIORITY_TONE[priority] ?? "neutral"} />
                  {!isRead && <Tag label="New" tone="info" />}
                </View>
                <Text style={{ ...typeScale.title, color: colors.text }}>{circTitle}</Text>
                <Text style={{ ...typeScale.caption, color: colors.textMuted, marginTop: spacing.sm }}>
                  {createdAt ? formatDate(createdAt) : ""}
                </Text>
              </View>
            </View>
          </Card>

          <Card padding="lg" style={{ marginBottom: spacing.md }}>
            <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.sm }}>Message</Text>
            <Text style={{ ...typeScale.body, lineHeight: 24, color: colors.text }}>
              {circBody || "No additional details available."}
            </Text>
          </Card>

          {createdBy && (
            <Card padding="sm" style={{ marginBottom: spacing.lg }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radius.sm,
                    backgroundColor: colors.surfaceSubtle,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                </View>
                <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>
                  Posted by <Text style={{ fontWeight: "700", color: colors.text }}>{createdBy.name}</Text>
                </Text>
              </View>
            </Card>
          )}
        </>
      )}
    </AppContainer>
  );
}