const API_SUFFIX = "api/v1";

function normalizeApiUrl(raw) {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  return trimmed.endsWith(`/${API_SUFFIX}`) ? trimmed : `${trimmed}/${API_SUFFIX}`;
}

function resolveProfile() {
  if (process.env.EAS_BUILD_PROFILE) return process.env.EAS_BUILD_PROFILE;
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
}

const profile = resolveProfile();
const apiUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);

module.exports = {
  expo: {
    name: "School Student",
    slug: "school-student",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "school-student",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.folkslogic.schoolstudent",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "@react-native-community/datetimepicker",
      "expo-secure-store",
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "9d2d91c1-c334-49b0-b5c2-e9865b3c7a49",
      },
      profile,
      apiUrl,
    },
    owner: "vijaytallolli",
  },
};