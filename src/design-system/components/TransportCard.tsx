/**
 * TransportCard — Design System. Route / bus status card for the dashboard.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";

export interface TransportSnapshot {
  routeName?: string | null;
  busNumber?: string | null;
  driverName?: string | null;
  pickupTime?: string | null;
  dropTime?: string | null;
  running: boolean;
}

export const TransportCard = memo(function TransportCard({ snapshot }: { snapshot: TransportSnapshot }) {
  const { colors } = useTheme();
  const dotC = snapshot.running ? colors.success : colors.error;
  const label = snapshot.running ? "Running" : "Scheduled";

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.lg,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: `${colors.brand}1A`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="bus" size={20} color={colors.brand} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
            {snapshot.routeName ?? "Bus route"}
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 1 }} numberOfLines={1}>
            {snapshot.busNumber ? `Bus ${snapshot.busNumber}` : ""}
            {snapshot.driverName ? ` · ${snapshot.driverName}` : ""}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotC, marginRight: 6 }} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: dotC, lineHeight: 16 }}>{label}</Text>
        </View>
      </View>
      {snapshot.pickupTime || snapshot.dropTime ? (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md }}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, fontWeight: "500" }}>
            {snapshot.pickupTime ? `Pickup ${snapshot.pickupTime}` : ""}
            {snapshot.pickupTime && snapshot.dropTime ? " · " : ""}
            {snapshot.dropTime ? `Drop ${snapshot.dropTime}` : ""}
          </Text>
        </View>
      ) : null}
    </View>
  );
});