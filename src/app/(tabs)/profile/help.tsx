import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card, AppContainer, AppHeader } from "@/design-system/components";
import { useTheme, spacing, radius, typeScale } from "@/design-system";

const CONTACT_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
  { icon: "call-outline", label: "Call School Office", value: "Contact the school administration during office hours" },
  { icon: "mail-outline", label: "Email Support", value: "Send an email to the school support team" },
  { icon: "chatbubble-ellipses-outline", label: "In-App Chat", value: "Chat with support during working hours" },
  { icon: "information-circle-outline", label: "FAQ", value: "Check frequently asked questions" },
];

export default function HelpScreen() {
  const { colors } = useTheme();

  return (
    <AppContainer>
      <AppHeader title="Help & Support" showBack onBack={() => router.back()} />

      <Card padding="lg" style={{ marginBottom: spacing.xl }}>
        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.full,
              backgroundColor: `${colors.brand}14`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="help-circle-outline" size={32} color={colors.brand} />
          </View>
          <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>
            How can we help you?
          </Text>
          <Text
            style={{
              ...typeScale.bodySm,
              color: colors.textSecondary,
              marginTop: spacing.xs,
              textAlign: "center",
            }}
          >
            Reach out to the school for any questions or issues.
          </Text>
        </View>
      </Card>

      <Card padding="none" style={{ overflow: "hidden", marginBottom: spacing.xl }}>
        {CONTACT_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.lg,
              borderBottomWidth: index < CONTACT_ITEMS.length - 1 ? 1 : 0,
              borderBottomColor: colors.divider,
            }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radius.md,
                backgroundColor: colors.surfaceSubtle,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>{item.label}</Text>
              <Text style={{ ...typeScale.caption, color: colors.textMuted, marginTop: 2 }}>
                {item.value}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </Card>

      <Card padding="lg">
        <Text style={{ ...typeScale.bodyStrong, color: colors.text, marginBottom: spacing.sm }}>
          School Office Hours
        </Text>
        <Text
          style={{
            ...typeScale.bodySm,
            color: colors.textSecondary,
            lineHeight: typeScale.body.lineHeight,
          }}
        >
          {"Monday – Friday: 8:00 AM – 4:00 PM\nSaturday: 8:00 AM – 12:00 PM\nSunday: Closed"}
        </Text>
      </Card>
    </AppContainer>
  );
}