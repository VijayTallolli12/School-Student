import { View, Text } from "react-native";
import { router } from "expo-router";
import { Card, AppContainer, AppHeader } from "@/design-system/components";
import { useTheme, spacing, typeScale } from "@/design-system";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Data Protection",
    body: "Your personal data and your child academic information are stored securely and used only for school-related purposes. We do not sell or share your data with third parties without consent.",
  },
  {
    title: "Information We Collect",
    body: "We collect information necessary for school operations including guardian contact details, student academic records, attendance data, fee payment history, and communication preferences.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, update, or request deletion of your personal data. For any privacy-related requests, please contact the school administration.",
  },
  {
    title: "Contact",
    body: "For privacy concerns, reach out to the school data protection officer at the school office or via email.",
  },
];

export default function PrivacyScreen() {
  const { colors } = useTheme();

  return (
    <AppContainer>
      <AppHeader title="Privacy" showBack onBack={() => router.back()} />

      {SECTIONS.map((section, index) => (
        <Card key={section.title} padding="lg" style={{ marginBottom: index < SECTIONS.length - 1 ? spacing.lg : 0 }}>
          <Text style={{ ...typeScale.bodyStrong, color: colors.text, marginBottom: spacing.sm }}>
            {section.title}
          </Text>
          <Text style={{ ...typeScale.bodySm, color: colors.textSecondary, lineHeight: typeScale.body.lineHeight }}>
            {section.body}
          </Text>
        </Card>
      ))}

      <View style={{ marginTop: spacing["3xl"], alignItems: "center" }}>
        <Text style={{ ...typeScale.caption, color: colors.textTertiary }}>
          Version 1.0 • Last updated May 2026
        </Text>
      </View>
    </AppContainer>
  );
}