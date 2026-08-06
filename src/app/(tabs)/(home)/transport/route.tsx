import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchTransportDashboard, getErrorMessage } from "@/services/api";
import type { TransportDashboardData, TransportStop } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import {
  AppContainer,
  AppHeader,
  Card,
  EmptyState,
  ErrorState,
  SectionHeader,
  FadeInView,
  Tag,
} from "@/design-system/components";

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function TransportRouteScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<TransportDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const loadTransport = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchTransportDashboard(studentUuid);
      setData(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadTransport();
  }, [loadTransport]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransport();
  }, [loadTransport]);

  const transport = data?.transport;
  const stops = data?.stops ?? [];

  const { colors } = useTheme();

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Route Details" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading route details...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : !transport ? (
        <EmptyState
          icon="map-outline"
          title="No Route Assigned"
          description="Route details will appear once transport is assigned."
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          <FadeInView>
            <SectionHeader title="Route Information" />
            <Card padding="lg">
              <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Route Name</Text>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.route_name ?? "—"}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typeScale.caption, color: colors.success, fontWeight: "700" }}>Start Point</Text>
                    <Text style={{ ...typeScale.body, color: colors.text }}>{transport.route_start ?? "—"}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typeScale.caption, color: colors.error, fontWeight: "700" }}>End Point</Text>
                    <Text style={{ ...typeScale.body, color: colors.text }}>{transport.route_end ?? "—"}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </FadeInView>

          <FadeInView>
            <SectionHeader title="Vehicle" />
            <Card padding="lg">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: `${colors.info}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="bus-outline" size={20} color={colors.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.vehicle_number ?? "—"}</Text>
                  {transport.vehicle_name ? (
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{transport.vehicle_name}</Text>
                  ) : null}
                  {transport.vehicle_type ? (
                    <Text style={{ ...typeScale.bodySm, color: colors.textTertiary }}>
                      {transport.vehicle_type.replace("_", " ")}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          </FadeInView>

          <FadeInView>
            <SectionHeader title="Driver" />
            <Card padding="lg">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: `${colors.secondary}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.driver_name ?? "—"}</Text>
                  {transport.driver_mobile ? (
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{transport.driver_mobile}</Text>
                  ) : null}
                </View>
              </View>
            </Card>
          </FadeInView>

          {stops.length > 0 ? (
            <FadeInView>
              <SectionHeader title="Stop Sequence" />
              <Card padding="lg">
                <View style={{ gap: spacing.md }}>
                  {stops.map((stop: TransportStop, index: number) => (
                    <View key={stop.id} style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: radius.full,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: stop.is_student_stop ? colors.brand : colors.surfaceSunken,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: stop.is_student_stop ? colors.onBrand : colors.textSecondary,
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            ...typeScale.bodySm,
                            color: stop.is_student_stop ? colors.text : colors.textSecondary,
                            fontWeight: stop.is_student_stop ? "600" : "400",
                          }}
                        >
                          {stop.stop_name}
                        </Text>
                      </View>
                      <Text style={{ ...typeScale.caption, color: colors.textTertiary }}>{formatTime(stop.pickup_time)}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </FadeInView>
          ) : null}

          <FadeInView>
            <SectionHeader title="Pickup & Drop" />
            <Card padding="lg">
              <View style={{ gap: spacing.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: radius.full,
                      backgroundColor: `${colors.success}1A`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="arrow-up-outline" size={16} color={colors.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Pickup</Text>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.pickup_stop ?? "—"}</Text>
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{formatTime(transport.pickup_time)}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: radius.full,
                      backgroundColor: `${colors.error}1A`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="arrow-down-outline" size={16} color={colors.error} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Drop</Text>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.drop_stop ?? "—"}</Text>
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{formatTime(transport.drop_time)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </FadeInView>

          <FadeInView>
            <Card padding="lg">
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ ...typeScale.overline, color: colors.textMuted }}>Status</Text>
                <Tag label={transport.status} tone={transport.status === "active" ? "success" : "neutral"} />
              </View>
            </Card>
          </FadeInView>
        </View>
      )}
    </AppContainer>
  );
}
