
export const APP_NAME = "School Student";
export const APP_VERSION = "1.0.0";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "school_student_auth_token",
  ACCESS_TOKEN: "school_student_access_token",
  REFRESH_TOKEN: "school_student_refresh_token",
  TOKEN_TYPE: "school_student_token_type",
  TOKEN_EXPIRES_AT: "school_student_token_expires_at",
  USER_DATA: "school_student_user_data",
  STUDENTS: "school_student_students",
} as const;

export const QUERY_KEYS = {
  DASHBOARD: "dashboard",
  STUDENTS: "students",
  ATTENDANCE: "attendance",
  FEES: "fees",
  HOMEWORK: "homework",
  NOTIFICATIONS: "notifications",
  TIMETABLE: "timetable",
  RESULTS: "results",
  LEAVE_REQUESTS: "leave-requests",
  CALENDAR: "calendar",
  DOCUMENTS: "documents",
  ANNOUNCEMENTS: "announcements",
} as const;