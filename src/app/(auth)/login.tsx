import { useState, useCallback, useRef, useEffect } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  Alert,
  Image,
  type TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { useBrandingStore } from "@/store/branding.store";
import apiClient, { getErrorMessage } from "@/services/api";
import { persistTokens } from "@/utils/secureTokens";
import { Input } from "@/components/ui/Input";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { Button, KeyboardScrollView } from "@/design-system/components";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function mapStudent(raw: Record<string, unknown>) {
  return {
    id: (raw.id as number) ?? 0,
    uuid: (raw.uuid as string) ?? "",
    name: (raw.name as string) ?? "",
    class: (raw.class as string) ?? "",
    section: (raw.section as string) ?? "",
    roll_number: (raw.roll_number as string) ?? "",
    admission_no: (raw.admission_no as string) ?? "",
    avatar_url: ((raw.avatar_url as string) ?? (raw.photo as string) ?? null),
  };
}

function extractStudents(payload: {
  user?: Record<string, unknown>;
  students?: Record<string, unknown>[];
  student?: Record<string, unknown>;
}): Record<string, unknown>[] {
  if (Array.isArray(payload.students) && payload.students.length > 0) {
    return payload.students;
  }

  const user = payload.user;
  if (user && typeof user === "object") {
    const userStudents = user.students;
    if (Array.isArray(userStudents) && userStudents.length > 0) {
      return userStudents as Record<string, unknown>[];
    }

    const userStudent = user.student;
    if (userStudent && typeof userStudent === "object") {
      return [userStudent as Record<string, unknown>];
    }
  }

  if (payload.student && typeof payload.student === "object") {
    return [payload.student];
  }

  return [];
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hydrateFromApi = useAuthStore((s) => s.hydrateFromApi);
  const branding = useBrandingStore((s) => s.branding);
  const refreshBranding = useBrandingStore((s) => s.refreshBranding);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = useCallback(async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: wrapper } = await apiClient.post("/auth/login", values);
      if (!wrapper || !wrapper.success) {
        throw new Error(wrapper?.message ?? "Login failed. Please check your credentials.");
      }
      const payload: {
        token: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
        user: Record<string, unknown>;
        students?: Record<string, unknown>[];
        student?: Record<string, unknown>;
        student_uuid?: string;
      } = wrapper.data;
      if (!payload || !payload.token) {
        throw new Error("Login did not return valid user credentials.");
      }

      const mappedUser = {
        id: payload.user.id as number,
        name: (payload.user.name as string) ?? "",
        email: (payload.user.email as string) ?? "",
        phone: (payload.user.phone as string) ?? "",
        avatar_url: (payload.user.avatar_url as string) ?? null,
        role: "student" as const,
      };

      const rawStudents = extractStudents(payload);
      const mappedStudents = rawStudents.map(mapStudent).filter((s) => !!s.uuid);

      const payloadUserStudentUuid =
        payload.user && typeof payload.user === "object"
          ? ((payload.user.student_uuid as string | undefined) ?? undefined)
          : undefined;
      const selectedStudentUuid =
        (payload.student_uuid as string | undefined) ??
        payloadUserStudentUuid ??
        mappedStudents[0]?.uuid ??
        undefined;

      hydrateFromApi({
        user: mappedUser,
        students: mappedStudents,
        token: payload.token,
        refresh_token: payload.refresh_token,
        token_type: payload.token_type,
        expires_in: payload.expires_in,
        student_uuid: selectedStudentUuid,
      });

      await persistTokens({
        accessToken: payload.token,
        refreshToken: payload.refresh_token ?? null,
        tokenType: payload.token_type,
        expiresInSeconds: payload.expires_in,
      });

      router.replace("/(tabs)/(home)");
    } catch (error: unknown) {
      const message = getErrorMessage(error) || "Login failed. Please check your credentials.";
      Alert.alert("Login Error", message);
    } finally {
      setIsSubmitting(false);
    }
  }, [hydrateFromApi]);

  const appName = branding.appName || "School ERP";
  const schoolName = branding.schoolName || "School ERP";
  const hasLogo = !!branding.schoolLogo;
  const primaryColor = branding.primaryColor;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        bottomOffset={spacing.xl}
      >
          <View
            style={{
              paddingHorizontal: spacing.xl,
              paddingTop: spacing["4xl"],
              paddingBottom: spacing.xl,
            }}
          >
            {hasLogo ? (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.xl,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing["2xl"],
                  overflow: "hidden",
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Image
                  source={{ uri: branding.schoolLogo as string }}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.xl,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing["2xl"],
                  backgroundColor: `${primaryColor}14`,
                }}
              >
                <Ionicons name="school-outline" size={36} color={primaryColor} />
              </View>
            )}
            <Text style={{ ...typeScale.displaySm, color: colors.text }}>
              Welcome to {schoolName}
            </Text>
            <Text
              style={{
                ...typeScale.body,
                color: colors.textSecondary,
                marginTop: spacing.sm,
              }}
            >
              Sign in to your {appName} account
            </Text>
          </View>

          <View style={{ paddingHorizontal: spacing.xl, flex: 1 }}>
            <View style={{ gap: spacing.xl }}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="student@school.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon="mail-outline"
                    error={errors.email?.message}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="password"
                    leftIcon="lock-closed-outline"
                    isPassword
                    ref={passwordRef}
                    error={errors.password?.message}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onLogin)}
                  />
                )}
              />

              <View style={{ paddingTop: spacing.md }}>
                <Button title="Sign In" onPress={handleSubmit(onLogin)} loading={isSubmitting} size="lg" />
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center", paddingVertical: spacing["3xl"] }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 32, height: 1, backgroundColor: colors.divider }} />
              <Text style={{ ...typeScale.caption, color: colors.textTertiary, marginHorizontal: spacing.md }}>
                {appName}
              </Text>
              <View style={{ width: 32, height: 1, backgroundColor: colors.divider }} />
            </View>
            <Text style={{ ...typeScale.caption, color: colors.textTertiary, marginTop: spacing.sm }}>
              Powered by Folkslogic
            </Text>
          </View>
        </KeyboardScrollView>
    </SafeAreaView>
  );
}