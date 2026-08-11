import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { router, type Href } from "expo-router";
import { secureLogout } from "@/services/api";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Avatar, SectionHeader } from "@/design-system/components";

const MENU_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; route: string }[] = [
  { icon: "person-outline", label: "Edit Profile", route: "/profile/edit-profile" },
  { icon: "settings-outline", label: "Settings", route: "/profile/settings" },
  { icon: "lock-closed-outline", label: "Change Password", route: "/profile/change-password" },
  { icon: "notifications-outline", label: "Notifications", route: "/notifications" },
  { icon: "shield-checkmark-outline", label: "Privacy", route: "/profile/privacy" },
  { icon: "help-circle-outline", label: "Help & Support", route: "/profile/help" },
] as const;

export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await secureLogout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleMenuPress = (route: string) => {
    router.push(route as Href);
  };

  const selectedStudent = students.find((s) => s.uuid === studentUuid) ?? students[0] ?? null;
  const studentName = selectedStudent?.name || user?.name || "Student";
  const studentClassLine = selectedStudent
    ? `Class ${selectedStudent.class}-${selectedStudent.section} • Roll: ${selectedStudent.roll_number}`
    : null;
  const studentAvatar = selectedStudent?.avatar_url || user?.avatar_url || null;

  return (
    <AppContainer>
      <AppHeader title="Profile" />

      <Card padding="lg" style={{ alignItems: "center", marginBottom: spacing.lg }}>
        <Avatar uri={studentAvatar} name={studentName} size="xl" ring />
        <Text style={{ ...typeScale.title, color: colors.text, marginTop: spacing.md }}>
          {studentName}
        </Text>
        <Text style={{ ...typeScale.bodySm, color: colors.textSecondary, marginTop: spacing.xs }}>
          {studentClassLine || user?.email || "student@school.com"}
        </Text>
      </Card>

      <Card padding="none" style={{ overflow: "hidden", marginBottom: spacing.lg }}>
        {([
          { icon: "mail-outline", label: "Email", value: user?.email || "—" },
          { icon: "call-outline", label: "Phone", value: user?.phone || "—" },
        ] as { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[]).map((item, index, arr) => (
          <ContactRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            showBorder={index < arr.length - 1}
          />
        ))}
      </Card>

      {students.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader title="Linked Students" />
          <Card padding="none" style={{ overflow: "hidden" }}>
            {students.map((s, index) => (
              <ContactRow
                key={s.uuid}
                avatar={<Avatar name={s.name} size="sm" />}
                label={s.name}
                labelStrong
                value={`Class ${s.class}-${s.section} • Roll: ${s.roll_number}`}
                showBorder={index < students.length - 1}
              />
            ))}
          </Card>
        </View>
      )}

      <Card padding="none" style={{ overflow: "hidden", marginBottom: spacing["3xl"] }}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.lg,
              borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
              borderBottomColor: colors.divider,
            }}
            activeOpacity={0.7}
            onPress={() => handleMenuPress(item.route)}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                backgroundColor: colors.surfaceSubtle,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={item.icon} size={18} color={colors.textSecondary} />
            </View>
            <Text style={{ ...typeScale.bodyStrong, color: colors.text, marginLeft: spacing.md, flex: 1 }}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </Card>

      <TouchableOpacity
        style={{
          marginBottom: spacing.sm,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.error,
          padding: spacing.lg,
          alignItems: "center",
        }}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={{ ...typeScale.button, color: colors.error }}>Logout</Text>
      </TouchableOpacity>

      <Text style={{ ...typeScale.caption, color: colors.textTertiary, textAlign: "center", marginBottom: spacing.sm }}>
        OTA TEST UPDATED
      </Text>
    </AppContainer>
  );
}

function ContactRow({
  icon,
  avatar,
  label,
  labelStrong = false,
  value,
  showBorder,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  avatar?: React.ReactNode;
  label: string;
  labelStrong?: boolean;
  value: string;
  showBorder: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
        paddingVertical: 14,
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: colors.divider,
      }}
    >
      {avatar ? (
        <View style={{ marginRight: spacing.md }}>{avatar}</View>
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.sm,
            backgroundColor: colors.surfaceSubtle,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.md,
          }}
        >
          <Ionicons name={icon} size={16} color={colors.textSecondary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ ...typeScale.caption, color: colors.textTertiary }}>{label}</Text>
        <Text
          style={{
            ...(labelStrong ? typeScale.bodySmStrong : typeScale.bodySm),
            color: colors.text,
            marginTop: 2,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}