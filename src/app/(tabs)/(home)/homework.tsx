import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchHomework, getErrorMessage } from "@/services/api";
import type { HomeworkItem } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, EmptyState, ErrorState, HomeworkCard, FadeInView } from "@/design-system/components";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomeworkScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadHomework = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchHomework(studentUuid);
      setHomework(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadHomework();
  }, [loadHomework]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomework();
  }, [loadHomework]);

  const handleOpenAttachment = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {}
  };

  const sorted = [...homework].sort((a, b) => new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime());

  const { colors } = useTheme();

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Homework" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading homework...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon="book-outline"
          title="No Homework Assigned"
          description="Homework assignments will appear here once published by your teachers"
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {sorted.map((hw, index) => {
            const isExpanded = expandedId === hw.id;
            return (
              <FadeInView key={hw.id} index={Math.min(index, 5)}>
                <HomeworkCard item={hw} onPress={() => setExpandedId(isExpanded ? null : hw.id)} />

                {isExpanded && (
                  <Card variant="outlined" padding="none" style={{ marginTop: spacing.sm, overflow: "hidden" }}>
                    {hw.description ? (
                      <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                        <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.sm }}>
                          Description
                        </Text>
                        <Text style={{ ...typeScale.body, color: colors.text }}>{hw.description}</Text>
                      </View>
                    ) : null}

                    {hw.attachment_url ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleOpenAttachment(hw.attachment_url!)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: spacing.md,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.divider,
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: radius.sm,
                            backgroundColor: `${colors.info}1A`,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: spacing.md,
                          }}
                        >
                          <Ionicons name="document-outline" size={16} color={colors.info} />
                        </View>
                        <Text style={{ flex: 1, ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
                          View Attachment
                        </Text>
                        <Ionicons name="download-outline" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    ) : null}

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                        Assigned {formatDate(hw.assigned_date)}
                      </Text>
                      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.textTertiary} />
                    </View>
                  </Card>
                )}
              </FadeInView>
            );
          })}
        </View>
      )}
    </AppContainer>
  );
}
