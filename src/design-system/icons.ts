/**
 * Design System — Iconography Tokens.
 * Single icon family: Ionicons (rounded, friendly). Consistent sizes only.
 */
export const icons = {
  family: "Ionicons" as const,

  /** Canonical sizes — do NOT use anything outside this list. */
  size: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    hero: 48,
  } as const,

  /** Standard hit area around a touchable icon. */
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

export type IconSize = keyof typeof icons.size;

/** Semantic icon names used across the app (all exist in Ionicons). */
export const iconNames = {
  home: "home",
  profile: "person",
  academics: "school",
  homework: "book",
  timetable: "time",
  attendance: "calendar",
  exams: "calendar-clear",
  results: "trophy",
  fees: "wallet",
  circulars: "megaphone",
  documents: "folder-open",
  calendar: "calendar-number",
  transport: "bus",
  leave: "document-text",
  notifications: "notifications",
  streak: "flame",
  star: "star",
  trophy: "trophy",
  check: "checkmark-circle",
  chevronRight: "chevron-forward",
  arrowRight: "arrow-forward",
  arrowUpRight: "arrow-up-outline",
  alert: "alert-circle",
  offline: "cloud-offline",
  search: "search",
  close: "close",
  refresh: "refresh",
  sparkles: "sparkles",
  rocket: "rocket",
  target: "locate",
  puzzle: "puzzle",
  crown: "crown",
  heart: "heart",
  plus: "add",
  back: "chevron-back",
} as const;

export type IconName = keyof typeof iconNames | (string & {});