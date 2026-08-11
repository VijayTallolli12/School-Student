import { useState } from "react";
import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card, AppContainer, AppHeader } from "@/design-system/components";
import { useTheme, spacing, radius, typeScale } from "@/design-system";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <AppContainer>
      <AppHeader title="Settings" showBack onBack={() => router.back()} />

      <Card padding="none" style={{ overflow: "hidden", marginBottom: spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.sm,
              backgroundColor: colors.surfaceSubtle,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.md,
            }}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>Push Notifications</Text>
            <Text style={{ ...typeScale.caption, color: colors.textSecondary, marginTop: 2 }}>
              Receive alerts for attendance, fees and announcements.
            </Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            paddingVertical: 14,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.sm,
              backgroundColor: colors.surfaceSubtle,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.md,
            }}
          >
            <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>Email Updates</Text>
            <Text style={{ ...typeScale.caption, color: colors.textSecondary, marginTop: 2 }}>
              Receive summary updates in email.
            </Text>
          </View>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
      </Card>

      <Card padding="lg">
        <Text style={{ ...typeScale.bodyStrong, color: colors.text, marginBottom: spacing.sm }}>
          App Preferences
        </Text>
        <Text style={{ ...typeScale.bodySm, color: colors.textSecondary }}>
          Settings are device-specific and can be changed anytime.
        </Text>
      </Card>
    </AppContainer>
  );
}