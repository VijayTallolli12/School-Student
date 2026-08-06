import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchCalendar, getErrorMessage } from "@/services/api";
import type { CalendarEvent } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Chip, EmptyState, ErrorState, CalendarEventCard, FadeInView, SectionHeader } from "@/design-system/components";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EVENT_TYPES = ["", "holiday", "exam", "ptm", "sports_day", "annual_day", "school_event", "field_trip", "workshop"];
const EVENT_TYPE_LABELS: Record<string, string> = {
  "": "All Types",
  holiday: "Holidays",
  exam: "Exams",
  ptm: "PTM",
  sports_day: "Sports Day",
  annual_day: "Annual Day",
  school_event: "School Events",
  field_trip: "Field Trips",
  workshop: "Workshops",
};

export default function CalendarScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [eventType, setEventType] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalendar = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchCalendar(studentUuid, selectedMonth, selectedYear, eventType || undefined);
      setEvents(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid, selectedMonth, selectedYear, eventType]);

  useEffect(() => {
    setLoading(true);
    loadCalendar();
  }, [loadCalendar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCalendar();
  }, [loadCalendar]);

  const prevMonth = () => {
    setSelectedMonth((m) => {
      if (m === 1) {
        setSelectedYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  };
  const nextMonth = () => {
    setSelectedMonth((m) => {
      if (m === 12) {
        setSelectedYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  };

  const groupedByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    const key = ev.start_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const { colors } = useTheme();

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Academic Calendar" showBack onBack={() => router.back()} />

      <Card padding="md" style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
          <TouchableOpacity
            onPress={prevMonth}
            accessibilityLabel="Previous month"
            style={{ width: 36, height: 36, backgroundColor: colors.surfaceSubtle, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={{ ...typeScale.sectionTitle, color: colors.text }}>
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </Text>
          <TouchableOpacity
            onPress={nextMonth}
            accessibilityLabel="Next month"
            style={{ width: 36, height: 36, backgroundColor: colors.surfaceSubtle, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
          {EVENT_TYPES.map((type) => (
            <Chip key={type} label={EVENT_TYPE_LABELS[type] ?? type} selected={eventType === type} onPress={() => setEventType(type)} />
          ))}
        </ScrollView>
      </Card>

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading calendar...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No Events"
          description="No events found for this month and filter selection"
        />
      ) : (
        <View style={{ marginBottom: spacing["2xl"] }}>
          {sortedDates.map((date, dateIndex) => {
            const dayEvents = groupedByDate[date];
            return (
              <FadeInView key={date} index={Math.min(dateIndex, 5)}>
                <SectionHeader
                  title={new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                />
                <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                  {dayEvents.map((ev) => (
                    <CalendarEventCard key={ev.id} event={ev} />
                  ))}
                </View>
              </FadeInView>
            );
          })}
        </View>
      )}
    </AppContainer>
  );
}
