import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchExamSchedule, getErrorMessage } from "@/services/api";
import type { ExamScheduleItem } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, EmptyState, ErrorState, FadeInView } from "@/design-system/components";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(value: string | null): string {
  if (!value) return "—";
  const [hourPart = "0", minutePart = "00"] = value.split(":");
  const hour = Number(hourPart);
  const minute = minutePart;
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
}

export default function ExamScheduleScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const [schedule, setSchedule] = useState<ExamScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchedule = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);
      const result = await fetchExamSchedule(studentUuid);
      setSchedule(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSchedule();
  }, [loadSchedule]);

  const sorted = [...schedule].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());

  const { colors } = useTheme();

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Exam Schedule" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading exam schedule...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon="calendar-clear-outline"
          title="No Upcoming Exams"
          description="Published exam dates will appear here."
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {sorted.map((exam, index) => (
            <FadeInView key={exam.id} index={Math.min(index, 5)}>
              <Card padding="lg">
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flex: 1, marginRight: spacing.md }}>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={2}>
                      {exam.exam_name}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs }}>
                      {exam.subject_name ?? "General"}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.md,
                      backgroundColor: `${colors.brand}1A`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="school-outline" size={20} color={colors.brand} />
                  </View>
                </View>
                <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider }}>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>Date: {formatDate(exam.exam_date)}</Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs }}>
                    Time: {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs }}>
                    Room: {exam.room ?? "TBA"}
                  </Text>
                </View>
              </Card>
            </FadeInView>
          ))}
        </View>
      )}
    </AppContainer>
  );
}
