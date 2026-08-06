import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useBrandingStore } from "@/store/branding.store";
import { useAuthStore } from "@/store/auth.store";
import { fetchDashboard, fetchDashboardHighlights, getErrorMessage } from "@/services/api";
import type { DashboardData, DashboardHighlights, NotificationItem } from "@/types";
import { useTheme } from "@/design-system/theme";
import { spacing, radius } from "@/design-system";
import {
  AppContainer,
  HeroCard,
  QuickActionButton,
  StatCard,
  HighlightCard,
  AttendanceCard,
  SectionHeader,
  NotificationCard,
  EmptyState,
  ErrorState,
  FadeInView,
  Skeleton,
} from "@/design-system/components";
import type { AttendanceSnapshot } from "@/design-system/components";

function formatCompactCurrency(amount: number): string {
  const a = amount ?? 0;
  if (a >= 100000) {
    const lakhs = a / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (a >= 1000) {
    const thousands = a / 1000;
    return `₹${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `₹${a}`;
}

function formatAcademicYear(now: Date): string {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (month >= 4) return `${year}-${String(year + 1).slice(2)}`;
  return `${year - 1}-${String(year).slice(2)}`;
}

function readStudentField(student: Record<string, unknown> | null, keys: string[]): string {
  if (!student) return "";
  for (const key of keys) {
    const value = student[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const QUOTES = [
  "Small steps today, big wins tomorrow.",
  "Every expert was once a beginner.",
  "Learning today, leading tomorrow.",
  "Stay curious, keep growing.",
  "Your effort is your superpower.",
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [highlights, setHighlights] = useState<DashboardHighlights | null>(null);
  const [highlightsLoading, setHighlightsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { colors } = useTheme();
  const branding = useBrandingStore((s) => s.branding);
  const refreshBranding = useBrandingStore((s) => s.refreshBranding);
  const authStudents = useAuthStore((s) => s.students);
  const selectedStudentUuid = useAuthStore((s) => s.studentUuid);

  const studentUuid = selectedStudentUuid ?? authStudents?.[0]?.uuid ?? "";

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchDashboard();
      setData(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHighlights = useCallback(async () => {
    if (!studentUuid) {
      setHighlightsLoading(false);
      return;
    }
    try {
      const result = await fetchDashboardHighlights(studentUuid);
      setHighlights(result);
    } finally {
      setHighlightsLoading(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadDashboard();
    loadHighlights();
  }, [loadDashboard, loadHighlights]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(), loadHighlights(), refreshBranding()]);
    setRefreshing(false);
  }, [loadDashboard, loadHighlights, refreshBranding]);

  const dashboardStudents = Array.isArray(data?.students) ? data.students : [];
  const firstStudent = (dashboardStudents[0] ?? null) as Record<string, unknown> | null;
  const authStudent = useMemo(() => {
    if (!Array.isArray(authStudents) || authStudents.length === 0) return null;
    if (selectedStudentUuid) {
      return authStudents.find((s) => s.uuid === selectedStudentUuid) ?? authStudents[0] ?? null;
    }
    return authStudents[0] ?? null;
  }, [authStudents, selectedStudentUuid]);

  const studentDisplayName =
    readStudentField(firstStudent, ["name", "full_name", "student_name", "first_name"]) ||
    authStudent?.name ||
    "Student";
  const studentClass =
    readStudentField(firstStudent, ["class", "class_name", "grade", "standard"]) ||
    authStudent?.class ||
    "-";
  const studentSection =
    readStudentField(firstStudent, ["section", "section_name", "division"]) ||
    authStudent?.section ||
    "-";
  const studentRoll =
    readStudentField(firstStudent, ["roll_number", "roll_no", "roll"]) ||
    authStudent?.roll_number ||
    "-";
  const studentPhoto =
    readStudentField(firstStudent, ["avatar_url", "photo"]) ||
    authStudent?.avatar_url ||
    "";

  const notifs = Array.isArray(data?.notifications) ? data.notifications : [];
  const attSummary = data?.attendance_summary;
  const feesSummary = data?.fees_summary;
  const examsSummary = data?.exam_results_summary;

  const today = useMemo(() => new Date(), []);
  const academicYear = formatAcademicYear(today);
  const attendancePct = Math.round(attSummary?.percentage ?? 0);

  const attendanceSnapshot: AttendanceSnapshot = {
    present: attSummary?.present ?? 0,
    absent: attSummary?.absent ?? 0,
    late: 0,
    total: attSummary?.total ?? 0,
    percentage: attSummary?.percentage ?? 0,
  };

  const heroContext = useMemo(() => {
    if (highlights && highlights.homeworkDueToday > 0) {
      return `You have ${highlights.homeworkDueToday} homework ${highlights.homeworkDueToday === 1 ? "item" : "items"} due today`;
    }
    if (highlights?.upcomingExam) {
      return `Next exam · ${highlights.upcomingExam.exam_name} on ${formatShortDate(highlights.upcomingExam.exam_date)}`;
    }
    if (attendancePct > 0 && attendancePct < 75) {
      return `Attendance at ${attendancePct}% — keep it up!`;
    }
    if (feesSummary && feesSummary.pending > 0) {
      return `${formatCompactCurrency(feesSummary.pending)} fee due`;
    }
    if (attendancePct >= 90) {
      return "You're crushing it — keep going!";
    }
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, [highlights, attendancePct, feesSummary, today]);

  const handleOpenNotification = useCallback((item: NotificationItem) => {
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

  const handleViewAll = useCallback(() => router.push("/academics" as Href), []);

  const highlightTiles = useMemo(() => {
    const tiles: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string; onPress: () => void; empty: boolean }[] = [];

    if (!highlightsLoading) {
      if (highlights) {
        const todayDow = today.getDay();
        const dayKey = todayDow === 0 ? "7" : String(todayDow);
        const todaysSlots = highlights.timetable?.[dayKey] ?? [];
        const periods = Array.isArray(todaysSlots) ? todaysSlots.length : 0;
        tiles.push({
          key: "timetable",
          icon: "time-outline",
          label: "Today's Timetable",
          value: periods > 0 ? `${periods} class${periods === 1 ? "" : "es"} today` : "No classes today 🎉",
          color: colors.info,
          empty: periods === 0,
          onPress: () => router.push("/timetable" as Href),
        });

        tiles.push({
          key: "homework",
          icon: "book-outline",
          label: "Homework Due Today",
          value: highlights.homeworkDueToday > 0 ? `${highlights.homeworkDueToday} due today` : "No homework today 🎉",
          color: colors.warning,
          empty: highlights.homeworkDueToday === 0,
          onPress: () => router.push("/homework" as Href),
        });

        tiles.push({
          key: "exam",
          icon: "calendar-clear-outline",
          label: "Upcoming Exam",
          value: highlights.upcomingExam ? highlights.upcomingExam.exam_name : "No exams scheduled",
          color: colors.accent,
          empty: !highlights.upcomingExam,
          onPress: () => router.push("/exam-schedule" as Href),
        });

        tiles.push({
          key: "notice",
          icon: "megaphone-outline",
          label: "New Notices",
          value: highlights.unreadNotices > 0 ? `${highlights.unreadNotices} unread` : "All caught up",
          color: colors.success,
          empty: highlights.unreadNotices === 0,
          onPress: () => router.push("/notifications" as Href),
        });

        if (highlights.busEnabled) {
          tiles.push({
            key: "bus",
            icon: "bus-outline",
            label: "Bus Status",
            value: highlights.busActive ? "On the way" : "Not running",
            color: colors.secondary,
            empty: !highlights.busActive,
            onPress: () => router.push("/transport" as Href),
          });
        }
      }
    }
    return tiles;
  }, [highlights, highlightsLoading, colors, today]);

  const highlightRows = useMemo(() => {
    const rows: { left: typeof highlightTiles[number]; right?: typeof highlightTiles[number] }[] = [];
    for (let i = 0; i < highlightTiles.length; i += 2) {
      rows.push({ left: highlightTiles[i], right: highlightTiles[i + 1] });
    }
    return rows;
  }, [highlightTiles]);

  const feeStatus =
    feesSummary && feesSummary.pending > 0
      ? `${formatCompactCurrency(feesSummary.pending)} due`
      : "Status: Paid";

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
      {loading ? (
        <View>
          <Skeleton height={150} radius={radius["2xl"]} />
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
            <Skeleton height={104} radius={radius.lg} style={{ flex: 1 }} />
            <Skeleton height={104} radius={radius.lg} style={{ flex: 1 }} />
            <Skeleton height={104} radius={radius.lg} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
            <Skeleton height={92} radius={radius.lg} style={{ flex: 1 }} />
            <Skeleton height={92} radius={radius.lg} style={{ flex: 1 }} />
          </View>
        </View>
      ) : error ? (
        <View style={{ paddingTop: spacing["4xl"] }}>
          <ErrorState message={error} onRetry={onRefresh} />
        </View>
      ) : !firstStudent ? (
        <View style={{ paddingTop: spacing["4xl"] }}>
          <EmptyState
            icon="people-outline"
            title="No Student Linked"
            description="Student profile could not be loaded for this account."
            actionLabel="Retry"
            onAction={onRefresh}
          />
        </View>
      ) : (
        <>
          <FadeInView style={{ marginBottom: spacing.lg }}>
            <HeroCard
              greeting={greetingFor(today.getHours())}
              dateLine={today.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              studentName={studentDisplayName}
              classLine={`Class ${studentClass} · Section ${studentSection} · Roll ${studentRoll} · AY ${academicYear}`}
              avatarUri={studentPhoto || null}
              schoolLogo={branding.schoolLogo as string | null}
              schoolName={branding.schoolName || null}
              context={heroContext}
            />
          </FadeInView>

          {/* Today's Highlights */}
          <FadeInView index={1} style={{ marginBottom: spacing.lg }}>
            <SectionHeader title="Today's Highlights" />
            {highlightsLoading ? (
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Skeleton height={96} radius={radius.lg} style={{ flex: 1 }} />
                <Skeleton height={96} radius={radius.lg} style={{ flex: 1 }} />
              </View>
            ) : highlightRows.length === 0 ? null : (
              highlightRows.map((row) => (
                <View key={`row-${row.left.key}-${row.right?.key ?? "end"}`} style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }}>
                  <HighlightCard
                    icon={row.left.icon}
                    label={row.left.label}
                    value={row.left.value}
                    color={row.left.color}
                    empty={row.left.empty}
                    onPress={row.left.onPress}
                  />
                  {row.right ? (
                    <HighlightCard
                      icon={row.right.icon}
                      label={row.right.label}
                      value={row.right.value}
                      color={row.right.color}
                      empty={row.right.empty}
                      onPress={row.right.onPress}
                    />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </View>
              ))
            )}
          </FadeInView>

          <FadeInView index={2} style={{ marginBottom: spacing.lg }}>
            <SectionHeader title="At a glance" actionLabel="Academics" onAction={handleViewAll} />
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.sm }}>
              <StatCard
                label="Attendance"
                value={`${attendancePct}%`}
                icon="calendar-outline"
                color={attendancePct >= 75 ? colors.success : colors.warning}
                subtitle={attSummary ? `${attSummary.present} present · ${attSummary.absent} absent` : undefined}
                emphasized
              />
              <StatCard
                label="Fee pending"
                value={feesSummary ? formatCompactCurrency(feesSummary.pending) : "₹0"}
                icon="wallet-outline"
                color={colors.error}
                subtitle={feeStatus}
                delta={feesSummary && feesSummary.pending > 0 ? { label: "due", positive: false } : undefined}
              />
              <StatCard
                label="Overall"
                value={examsSummary ? `${examsSummary.average}%` : "-"}
                icon="trophy-outline"
                color={colors.brand}
                subtitle={examsSummary ? `${examsSummary.subjects} subjects` : "Performance"}
              />
            </View>
          </FadeInView>

          <FadeInView index={3} style={{ marginBottom: spacing["2xl"] }}>
            <SectionHeader title="Quick actions" actionLabel="All modules" onAction={handleViewAll} />
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md }}>
              <QuickActionButton
                label="Homework"
                icon="book-outline"
                color={colors.warning}
                onPress={() => router.push("/homework" as Href)}
              />
              <QuickActionButton
                label="Attendance"
                icon="calendar-outline"
                color={colors.success}
                onPress={() => router.push("/attendance" as Href)}
              />
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <QuickActionButton
                label="Exams"
                icon="ribbon-outline"
                color={colors.secondary}
                onPress={() => router.push("/results" as Href)}
              />
              <QuickActionButton
                label="Fees"
                icon="wallet-outline"
                color={colors.info}
                onPress={() => router.push("/fees" as Href)}
              />
            </View>
          </FadeInView>

          <FadeInView index={4} style={{ marginBottom: spacing.xl }}>
            <SectionHeader title="Attendance" actionLabel="Details" onAction={() => router.push("/attendance" as Href)} />
            <View style={{ marginTop: spacing.sm }}>
              <AttendanceCard snapshot={attendanceSnapshot} />
            </View>
          </FadeInView>

          <FadeInView index={5} style={{ marginBottom: spacing["2xl"] }}>
            <SectionHeader title="Recent updates" actionLabel="View all" onAction={() => router.push("/notifications" as Href)} />
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: radius["2xl"],
                borderWidth: 1,
                borderColor: colors.divider,
                overflow: "hidden",
                marginTop: spacing.sm,
              }}
            >
              {notifs.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: 24 }}>
                  <Ionicons name="notifications-off-outline" size={24} color={colors.textTertiary} />
                  <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 13 }}>No updates yet</Text>
                </View>
              ) : (
                notifs.slice(0, 3).map((item) => (
                  <NotificationCard key={item.id} item={item} onPress={() => handleOpenNotification(item)} />
                ))
              )}
            </View>
          </FadeInView>
        </>
      )}
    </AppContainer>
  );
}
