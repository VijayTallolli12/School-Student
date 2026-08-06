import { useState, useCallback, useEffect } from "react";
import { Alert, View, Text } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/Input";
import { Card, Avatar, Button, AppContainer, AppHeader } from "@/design-system/components";
import { useTheme, spacing, typeScale } from "@/design-system";
import { fetchProfile, updateProfile, getErrorMessage } from "@/services/api";

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const studentUuid = useAuthStore((s) => s.studentUuid);
  const setUser = useAuthStore((s) => s.setUser);

  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        if (data) {
          if (data.phone) setPhone(String(data.phone));
          if (data.email) setEmail(String(data.email));
          if (data.address) setAddress(String(data.address));
        }
      } catch {
        // use existing auth store values
      }
    };
    loadProfile();
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format";

    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!/^[+]?[\d\s\-()]{7,15}$/.test(phone)) errs.phone = "Invalid phone number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, phone]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    if (!studentUuid) return;

    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      if (phone !== user?.phone) payload.phone = phone;
      if (email !== user?.email) payload.email = email;
      if (address) payload.address = address;

      if (Object.keys(payload).length === 0) {
        Alert.alert("No Changes", "No changes were made to your profile.");
        setSubmitting(false);
        return;
      }

      await updateProfile(payload);

      if (email !== user?.email || phone !== user?.phone) {
        setUser({
          ...user!,
          email: email || user!.email,
          phone: phone || user!.phone,
        });
      }

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [validate, studentUuid, phone, email, address, user, setUser]);

  return (
    <AppContainer>
      <AppHeader title="Edit Profile" showBack onBack={() => router.back()} />

        <Card padding="lg" style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <Avatar uri={user?.avatar_url} name={user?.name || "P"} size="xl" ring />
          <Text style={{ ...typeScale.title, color: colors.text, marginTop: spacing.md }}>
            {user?.name || "Student User"}
          </Text>
          <Text style={{ ...typeScale.bodySm, color: colors.textMuted, marginTop: spacing.xs }}>
            Name cannot be changed. Contact school office.
          </Text>
        </Card>

        <Card padding="lg" style={{ marginBottom: spacing.lg }}>
          <View style={{ gap: spacing.xl }}>
            <Input
              label="Email"
              placeholder="student@school.com"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setErrors((e) => ({ ...e, email: "" }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label="Phone"
              placeholder="+91 9876543210"
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                setErrors((e) => ({ ...e, phone: "" }));
              }}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <Input
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              containerStyle={{ minHeight: 80 }}
              leftIcon="home-outline"
            />
          </View>
        </Card>

      <View style={{ paddingBottom: spacing["2xl"] }}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={submitting}
          size="lg"
          disabled={submitting}
        />
      </View>
    </AppContainer>
  );
}