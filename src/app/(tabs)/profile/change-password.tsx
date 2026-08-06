import { useState, useCallback } from "react";
import { Alert, View, Text } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/Input";
import { Card, AppContainer, AppHeader, Button } from "@/design-system/components";
import { useTheme, spacing, typeScale } from "@/design-system";
import { changePassword as changePasswordApi, getErrorMessage } from "@/services/api";

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const studentUuid = useAuthStore((s) => s.studentUuid);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!currentPassword.trim()) errs.currentPassword = "Current password is required";
    if (!newPassword.trim()) errs.newPassword = "New password is required";
    else if (newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword))
      errs.newPassword = "Must contain uppercase, lowercase, and a number";
    if (!confirmPassword.trim()) errs.confirmPassword = "Please confirm your new password";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    if (!studentUuid) return;

    setSubmitting(true);
    try {
      await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      Alert.alert("Success", "Password updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [validate, studentUuid, currentPassword, newPassword, confirmPassword]);

  return (
    <AppContainer>
      <AppHeader title="Change Password" showBack onBack={() => router.back()} />

        <Card padding="lg" style={{ marginBottom: spacing.lg }}>
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{ ...typeScale.overline, color: colors.textSecondary }}>
              Password Policy
            </Text>
            <Text
              style={{
                ...typeScale.bodySm,
                color: colors.textMuted,
                lineHeight: typeScale.bodySm.lineHeight,
                marginTop: spacing.md,
              }}
            >
              {"• At least 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number"}
            </Text>
          </View>
        </Card>

        <Card padding="lg" style={{ marginBottom: spacing.lg }}>
          <View style={{ gap: spacing.xl }}>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={(v) => {
                setCurrentPassword(v);
                setErrors((e) => ({ ...e, currentPassword: "" }));
              }}
              error={errors.currentPassword}
              isPassword
              leftIcon="lock-closed-outline"
            />

            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={(v) => {
                setNewPassword(v);
                setErrors((e) => ({ ...e, newPassword: "" }));
              }}
              error={errors.newPassword}
              isPassword
              leftIcon="lock-open-outline"
            />

            <Input
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                setErrors((e) => ({ ...e, confirmPassword: "" }));
              }}
              error={errors.confirmPassword}
              isPassword
              leftIcon="checkmark-circle-outline"
            />
          </View>
        </Card>

      <View style={{ paddingBottom: spacing["2xl"] }}>
        <Button
          title="Update Password"
          onPress={handleSubmit}
          loading={submitting}
          size="lg"
          disabled={submitting}
        />
      </View>
    </AppContainer>
  );
}