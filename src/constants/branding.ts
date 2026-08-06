import type { BrandingData, ThemeColors } from "@/types/branding";

export const DEFAULT_BRANDING: BrandingData = {
  schoolName: "School ERP",
  schoolLogo: null,
  favicon: null,
  primaryColor: "#7C4DFF",
  secondaryColor: "#2DB392",
  schoolWebsite: "",
  schoolAddress: "",
  schoolPhone: "",
  appName: "School Student",
};

export const DEFAULT_THEME: ThemeColors = {
  primary: "#7C4DFF",
  primaryLight: "rgba(124,77,255,0.08)",
  secondary: "#2DB392",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF3D5B",
  info: "#06B6D4",
  background: "#F7F6FC",
  backgroundCard: "#ffffff",
  text: "#1B1830",
  textSecondary: "#5C5B78",
  textMuted: "#A5A2BC",
};

export const BRANDING_CACHE_KEY = "school_student_branding";
export const BRANDING_CACHE_TTL_MS = 30 * 60 * 1000;
