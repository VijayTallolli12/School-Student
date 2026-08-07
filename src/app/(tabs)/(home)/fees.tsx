import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchFees, getErrorMessage } from "@/services/api";
import type { StudentFee } from "@/types";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, ProgressRing, EmptyState } from "@/design-system/components";

export default function FeesScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const loadFees = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchFees(studentUuid);
      setFees(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadFees();
  }, [loadFees]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFees();
  }, [loadFees]);

  const totalAmount = fees.reduce((s, f) => s + (f.total_amount ?? 0), 0);
  const totalPaid = fees.reduce((s, f) => s + (f.total_paid ?? 0), 0);
  const totalDue = fees.reduce((s, f) => s + (f.total_balance ?? 0), 0);
  const paidPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  const unpaidFees = fees.filter((f) => f.status === "unpaid" || f.status === "partial");
  const paidFees = fees.filter((f) => f.status === "paid");

  const statusColor = (status: string) =>
    status === "paid" ? colors.success : status === "partial" ? colors.warning : colors.error;

  return (
    <AppContainer
      scrollProps={{
        refreshControl: (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.success} colors={[colors.success]} />
        ),
      }}
    >
      <AppHeader title="Fees" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 14 }}>Loading fees...</Text>
        </View>
      ) : error ? (
        <View style={{ paddingTop: 40 }}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Connection Error"
            description={error ?? undefined}
            actionLabel="Retry"
            onAction={onRefresh}
          />
        </View>
      ) : fees.length === 0 ? (
        <View style={{ paddingTop: 40 }}>
          <EmptyState
            icon="wallet-outline"
            title="No Fee Records"
            description="Fee information will appear here once published by the school"
          />
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.divider,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.xl,
            }}
          >
            <ProgressRing value={paidPercentage / 100} size={80} strokeWidth={8} color={colors.success} label={`${paidPercentage}%`} />
            <View style={{ flex: 1, marginLeft: spacing.xl }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 }}>
                Total Fees
              </Text>
              <Text style={{ ...typeScale.metric, color: colors.text, marginTop: 2 }}>₹{totalAmount.toLocaleString()}</Text>
              <View style={{ flexDirection: "row", marginTop: spacing.sm, gap: spacing.xl }}>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.success, lineHeight: 20 }}>₹{totalPaid.toLocaleString()}</Text>
                  <Text style={{ fontSize: 11, lineHeight: 15, color: colors.textMuted, fontWeight: "500" }}>Paid</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.warning, lineHeight: 20 }}>₹{totalDue.toLocaleString()}</Text>
                  <Text style={{ fontSize: 11, lineHeight: 15, color: colors.textMuted, fontWeight: "500" }}>Due</Text>
                </View>
              </View>
            </View>
          </View>

          {unpaidFees.length > 0 && (
            <View
              style={{
                backgroundColor: `${colors.warning}0D`,
                borderColor: colors.warning,
                borderWidth: 1,
                borderRadius: radius.lg,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: spacing.xl,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.sm,
                  backgroundColor: `${colors.warning}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Ionicons name="alert-circle" size={22} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text, lineHeight: 19 }}>
                  {unpaidFees.length} Payment{unpaidFees.length > 1 ? "s" : ""} Due
                </Text>
                <Text style={{ fontSize: 12, lineHeight: 16, color: colors.warning, fontWeight: "500", marginTop: 1 }}>
                  Total due: ₹{totalDue.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.surfaceSubtle,
              borderRadius: radius.md,
              padding: 4,
              marginBottom: spacing.xl,
            }}
          >
            {(["overview", "history"] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: radius.sm,
                    alignItems: "center",
                    backgroundColor: active ? colors.card : "transparent",
                    shadowColor: active ? "#131022" : "transparent",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: active ? 0.08 : 0,
                    shadowRadius: 4,
                    elevation: active ? 1 : 0,
                  }}
                  onPress={() => setActiveTab(tab)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={{ fontSize: 14, lineHeight: 19, fontWeight: "600", color: active ? colors.brand : colors.textSecondary }}>
                    {tab === "overview" ? "Fee Structure" : "Payment History"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === "overview" && (
            <View style={{ gap: spacing.md, marginBottom: spacing["2xl"] }}>
              {fees.map((fee) => {
                const items = fee.items ?? [];
                const dueDate = items.find((i) => i.due_date)?.due_date ?? fee.assigned_at;
                const sc = statusColor(fee.status);
                return (
                  <View
                    key={fee.id}
                    style={{ backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.divider, overflow: "hidden" }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.surfaceSubtle, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }} numberOfLines={1}>
                        {dueDate
                          ? `Due: ${new Date(dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                          : `Fee #${fee.id}`}
                      </Text>
                      <View style={{ backgroundColor: `${sc}1A`, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 12, fontWeight: "700", color: sc, lineHeight: 16, textTransform: "capitalize" }}>
                          {fee.status}
                        </Text>
                      </View>
                    </View>
                    {items.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.md,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.divider,
                        }}
                      >
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.paid > 0 ? colors.success : colors.textTertiary, marginRight: spacing.md }} />
                        <Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 19, flexShrink: 1 }} numberOfLines={2}>
                          {item.fee_category ?? `Item #${item.id}`}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginRight: spacing.md, lineHeight: 19 }}>
                          ₹{item.amount.toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: "500", color: item.paid > 0 ? colors.success : colors.textMuted, lineHeight: 19 }}>
                          {item.paid > 0 ? `₹${item.paid.toLocaleString()}` : "—"}
                        </Text>
                      </View>
                    ))}
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: `${colors.surfaceSubtle}80` }}>
                      <Text style={{ flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 16 }}>
                        <Text style={{ fontWeight: "700", color: colors.text }}>Total:</Text> ₹{fee.total_amount.toLocaleString()}
                      </Text>
                      <Text style={{ fontSize: 12, lineHeight: 16, color: colors.warning }}>
                        <Text style={{ fontWeight: "700" }}>Balance:</Text> ₹{fee.total_balance.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === "history" && (
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.divider,
                overflow: "hidden",
                marginBottom: spacing["2xl"],
              }}
            >
              {paidFees.length > 0 ? (
                paidFees.map((fee, index) => {
                  const items = fee.items ?? [];
                  return (
                    <View
                      key={fee.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: spacing.md,
                        paddingVertical: 14,
                        borderBottomWidth: index < paidFees.length - 1 ? 1 : 0,
                        borderBottomColor: colors.divider,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: radius.sm,
                          backgroundColor: `${colors.success}1A`,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: spacing.md,
                        }}
                      >
                        <Ionicons name="receipt-outline" size={20} color={colors.success} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }} numberOfLines={2}>
                          {items[0]?.fee_category ?? `Fee #${fee.id}`}
                        </Text>
                        <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, marginTop: 2 }}>
                          {fee.assigned_at
                            ? `Paid on ${new Date(fee.assigned_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                            : ""}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.success }}>₹{fee.total_paid.toLocaleString()}</Text>
                    </View>
                  );
                })
              ) : (
                <EmptyState
                  icon="receipt-outline"
                  title="No Payment History"
                  description="Your payment records will appear here"
                />
              )}
            </View>
          )}
        </>
      )}
    </AppContainer>
  );
}