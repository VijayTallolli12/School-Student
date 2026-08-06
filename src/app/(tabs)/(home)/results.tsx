import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchExamResults, getErrorMessage } from "@/services/api";
import type { ExamResultRecord } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Chip, EmptyState, ErrorState, ExamSection, ProgressBar, FadeInView } from "@/design-system/components";

const getGradeFromPercentage = (percentage: number, colors: Record<string, string>) => {
  if (percentage >= 90) return { grade: "A+", color: colors.success };
  if (percentage >= 80) return { grade: "A", color: colors.success };
  if (percentage >= 70) return { grade: "B+", color: colors.info };
  if (percentage >= 60) return { grade: "B", color: colors.warning };
  if (percentage >= 50) return { grade: "C", color: colors.warning };
  return { grade: "D", color: colors.error };
};

interface GroupedExam {
  label: string;
  results: ExamResultRecord[];
}

export default function ResultsScreen() {
  const [groupedExams, setGroupedExams] = useState<GroupedExam[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const loadResults = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const data = await fetchExamResults(studentUuid);
      const groups: GroupedExam[] = Object.entries(data.results_by_academic_year).map(([year, results]) => ({
        label: year,
        results: results as unknown as ExamResultRecord[],
      }));
      setGroupedExams(groups);
      if (selectedIndex >= groups.length) setSelectedIndex(0);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid, selectedIndex]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadResults();
  }, [loadResults]);

  const currentGroup = groupedExams[selectedIndex];
  const results = currentGroup?.results ?? [];

  const totalMarks = results.reduce((s, r) => s + (r.maximum_marks ?? 0), 0);
  const obtainedMarks = results.reduce((s, r) => s + (r.marks_obtained ?? 0), 0);
  const overallPct = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

  const uniqueExams = new Map<string, { label: string; results: ExamResultRecord[] }>();
  results.forEach((r) => {
    const name = r.exam_name || "Unknown Exam";
    if (!uniqueExams.has(name)) uniqueExams.set(name, { label: name, results: [] });
    uniqueExams.get(name)!.results.push(r);
  });
  const examGroups = Array.from(uniqueExams.values());

  const { colors } = useTheme();
  const gradeInfo = getGradeFromPercentage(overallPct, colors as Record<string, string>);

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Exams & Results" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading results...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : groupedExams.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No Results Yet"
          description="Exam results will appear here once published"
        />
      ) : (
        <>
          {groupedExams.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.md }}>
              {groupedExams.map((group, index) => (
                <Chip key={group.label} label={group.label} selected={selectedIndex === index} onPress={() => setSelectedIndex(index)} />
              ))}
            </ScrollView>
          )}

          {results.length > 0 && (
            <>
              <FadeInView index={0}>
                <Card padding="lg" style={{ marginBottom: spacing.lg }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View>
                      <Text style={{ ...typeScale.overline, color: colors.textMuted }}>Overall Performance</Text>
                      <Text style={{ ...typeScale.metric, color: colors.text, marginTop: spacing.xs }}>{overallPct}%</Text>
                    </View>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: radius.lg,
                        backgroundColor: `${gradeInfo.color}1A`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 22, fontWeight: "800", color: gradeInfo.color }}>{gradeInfo.grade}</Text>
                    </View>
                  </View>
                  <View style={{ marginTop: spacing.lg }}>
                    <ProgressBar value={overallPct / 100} color={gradeInfo.color} height={8} />
                  </View>
                </Card>
              </FadeInView>

              {examGroups.map((examGroup, index) => (
                <FadeInView key={examGroup.label} index={Math.min(index + 1, 5)}>
                  <ExamSection title={examGroup.label} records={examGroup.results} />
                </FadeInView>
              ))}
            </>
          )}
        </>
      )}
    </AppContainer>
  );
}
