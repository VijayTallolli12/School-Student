import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchTransportDashboard, getErrorMessage } from "@/services/api";
import type { TransportDashboardData } from "@/types";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import {
  AppContainer,
  AppHeader,
  Card,
  EmptyState,
  ErrorState,
  TransportCard,
  Tag,
  SectionHeader,
  FadeInView,
} from "@/design-system/components";

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatCurrency(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `₹${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `₹${amount}`;
}

export default function TransportScreen() {
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
  const hasTransport = transport != null;

  const handleCallDriver = () => {
    if (transport?.driver_mobile) {
      Linking.openURL(`tel:${transport.driver_mobile}`);
    }
  };

  const { colors } = useTheme();

  return (
    <AppContainer
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />,
      }}
    >
      <AppHeader title="Transport" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading transport...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : !hasTransport ? (
        <EmptyState
          icon="bus-outline"
          title="No Transport Assigned"
          description="Your child does not have an active transport assignment. Please contact the school administration."
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          <FadeInView>
            <TransportCard
              snapshot={{
                routeName: transport.route_name,
                busNumber: transport.vehicle_number,
                driverName: transport.driver_name,
                pickupTime: formatTime(transport.pickup_time),
                dropTime: formatTime(transport.drop_time),
                running: transport.status === "active",
              }}
            />
          </FadeInView>

          <FadeInView>
            <SectionHeader title="Route & Driver" />
            <Card padding="lg" onPress={() => router.push("/transport/driver" as Href)} style={{ marginBottom: spacing.md }}>
              <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.md }}>Vehicle & Driver</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.md,
                    backgroundColor: `${colors.info}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="bus-outline" size={26} color={colors.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.vehicle_number ?? "—"}</Text>
                  <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{transport.vehicle_name ?? ""}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
              <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radius.full,
                      backgroundColor: `${colors.info}1A`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="person-outline" size={18} color={colors.info} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.driver_name ?? "—"}</Text>
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{transport.driver_mobile ?? ""}</Text>
                  </View>
                  {transport.driver_mobile ? (
                    <TouchableOpacity
                      onPress={handleCallDriver}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: `${colors.info}1A`,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.sm,
                      }}
                    >
                      <Ionicons name="call-outline" size={16} color={colors.info} />
                      <Text style={{ ...typeScale.bodySmStrong, color: colors.info, marginLeft: spacing.xs }}>Call</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </Card>

            <Card padding="lg" onPress={() => router.push("/transport/route" as Href)}>
              <Text style={{ ...typeScale.overline, color: colors.textMuted, marginBottom: spacing.md }}>Route</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: `${colors.success}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="map-outline" size={20} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.route_name ?? "—"}</Text>
                  <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>
                    {transport.route_start ?? ""} → {transport.route_end ?? ""}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </Card>
          </FadeInView>

          <FadeInView>
            <SectionHeader title="Pickup & Drop" />
            <Card padding="lg">
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                <View style={{ alignItems: "center" }}>
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
                  <View style={{ width: 2, height: 32, backgroundColor: colors.divider, marginTop: spacing.xs }} />
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
                </View>
                <View style={{ flex: 1, gap: spacing.md }}>
                  <View>
                    <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Pickup</Text>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.pickup_stop ?? "—"}</Text>
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{formatTime(transport.pickup_time)}</Text>
                  </View>
                  <View>
                    <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Drop</Text>
                    <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{transport.drop_stop ?? "—"}</Text>
                    <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>{formatTime(transport.drop_time)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </FadeInView>

          {stops.length > 0 ? (
            <FadeInView>
              <SectionHeader title="Stop Sequence" />
              <Card padding="lg">
                <View style={{ gap: spacing.md }}>
                  {stops.map((stop, index) => (
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
            <Card padding="lg">
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ ...typeScale.overline, color: colors.textMuted }}>Status</Text>
                <Tag label={transport.status} tone={transport.status === "active" ? "success" : "neutral"} />
              </View>
              {transport.monthly_fee != null ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider }}>
                  <Text style={{ ...typeScale.caption, color: colors.textMuted }}>Monthly Fee</Text>
                  <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{formatCurrency(transport.monthly_fee)}</Text>
                </View>
              ) : null}
            </Card>
          </FadeInView>
        </View>
      )}
    </AppContainer>
  );
}