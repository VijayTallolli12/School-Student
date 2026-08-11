import { create, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, getFallbackApiBaseUrl, isFallbackApiConfigured } from "@/config/api";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/config";
import { useAuthStore } from "@/store/auth.store";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  persistTokens,
} from "@/utils/secureTokens";
import type {
  AssignmentItem,
  AttendanceRecord,
  AttendanceData,
  CalendarEvent,
  CircularItem,
  DashboardData,
  ExamResultRecord,
  ExamScheduleItem,
  HomeworkItem,
  LeaveRequest,
  LeaveRequestPayload,
  NotificationItem,
  StudentDocument,
  StudentFee,
  TimetableData,
  TimetableSlot,
  TransportDashboardData,
  TransportData,
  TransportStop,
  DashboardHighlights,
} from "@/types";

type ApiResponseEnvelope<T> = { success: boolean; data: T; message?: string };

type RefreshTokenResponse = {
  token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean; _fallbackAttempted?: boolean };

const apiClient = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let useFallbackApi = false;

function switchToFallbackApi(): void {
  if (!useFallbackApi) {
    const fallbackUrl = getFallbackApiBaseUrl();
    if (!fallbackUrl) return;
    console.log("[API] Switching to fallback API:", fallbackUrl);
    apiClient.defaults.baseURL = fallbackUrl;
    useFallbackApi = true;
  }
}

async function resolveToken(): Promise<string | undefined> {
  const secureToken = await getAccessToken();
  if (secureToken) return secureToken;

  const raw = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (typeof raw === "string") return raw;

  const store = await storage.get<{ state?: { token?: string } }>("school_student_auth_store");
  return store?.state?.token;
}

async function clearAuthData(): Promise<void> {
  await clearTokens();
  await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  await storage.remove(STORAGE_KEYS.USER_DATA);
  await storage.remove("school_student_auth_store");
  const authStore = useAuthStore.getState();
  authStore.setToken(null);
  authStore.logout();
}

export async function secureLogout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // Best-effort server logout; local revocation always happens.
  } finally {
    await clearAuthData();
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const res = await apiClient.post<ApiResponseEnvelope<RefreshTokenResponse>>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const body = res.data;
      if (!body?.success || !body.data?.token) {
        return null;
      }

      await persistTokens({
        accessToken: body.data.token,
        refreshToken: body.data.refresh_token ?? refreshToken,
        tokenType: body.data.token_type,
        expiresInSeconds: body.data.expires_in,
      });

      useAuthStore.getState().setToken(body.data.token);
      return body.data.token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await resolveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const err = error as { response?: unknown; request?: unknown; message?: string };
    if (err.response) return false;
    if (err.request) return true;
    if (err.message === "Network Error") return true;
  }
  return false;
}

export function isTimeoutError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const err = error as { message?: string; code?: string };
    return err.code === "ECONNABORTED" || err.message?.includes("timeout") === true;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return "No internet connection. Please check your network settings.";
  }
  if (isTimeoutError(error)) {
    return "Request timed out. Please try again.";
  }
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message ?? err.message ?? "Something went wrong. Please try again.";
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const config = axiosError.config as RetryableRequestConfig | undefined;

    const requestUrl = config?.url ?? "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    const isNetworkOrTimeout = isNetworkError(error) || isTimeoutError(error);

    if (isNetworkOrTimeout && config && !config._fallbackAttempted && !useFallbackApi && isFallbackApiConfigured()) {
      config._fallbackAttempted = true;
      console.log("[API] Network/timeout error, attempting fallback API...");
      switchToFallbackApi();
      return apiClient(config);
    }

    if (status === 401 && config && !config._retry && !isAuthEndpoint) {
      config._retry = true;
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${refreshedToken}`;
        return apiClient(config);
      }
      await clearAuthData();
    } else if (status === 401) {
      await clearAuthData();
    }

    return Promise.reject(error);
  },
);

function unwrap<T>(response: { data: ApiResponseEnvelope<T> }): T {
  const body = response.data;
  if (!body?.success) {
    throw new Error(body?.message ?? "API request failed");
  }
  return body.data;
}

// ─── Student / Dashboard ────────────────────────────────────────────

function toRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toArray<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function pickArray<T = Record<string, unknown>>(
  payload: Record<string, unknown>,
  keys: string[],
): T[] {
  for (const key of keys) {
    const arr = toArray<T>(payload[key]);
    if (arr.length > 0) return arr;
  }
  return [];
}

function pickObject(payload: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const obj = toRecord(payload[key]);
    if (obj) return obj;
  }
  return null;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function normalizeDashboardStudent(raw: unknown): Record<string, unknown> | null {
  const student = toRecord(raw);
  if (!student) return null;

  const firstName = firstNonEmptyString(student.first_name);
  const lastName = firstNonEmptyString(student.last_name);
  const combinedName = `${firstName} ${lastName}`.trim();

  return {
    ...student,
    name: firstNonEmptyString(
      student.name,
      student.full_name,
      student.student_name,
      combinedName,
      student.username,
    ),
    class: firstNonEmptyString(student.class, student.class_name, student.grade, student.standard),
    section: firstNonEmptyString(student.section, student.section_name, student.division),
    roll_number: firstNonEmptyString(student.roll_number, student.roll_no, student.roll),
    admission_no: firstNonEmptyString(student.admission_no, student.admission_number, student.admissionId),
    avatar_url: firstNonEmptyString(student.avatar_url, student.photo) || null,
  };
}

function normalizeDashboardStudents(payload: Record<string, unknown>): Record<string, unknown>[] {
  const directStudents = payload.students;
  if (Array.isArray(directStudents)) {
    return directStudents
      .map((item) => normalizeDashboardStudent(item))
      .filter((item): item is Record<string, unknown> => !!item);
  }

  const directStudent = normalizeDashboardStudent(payload.student);
  if (directStudent) {
    return [directStudent];
  }

  const user = toRecord(payload.user);
  if (user) {
    const userStudents = user.students;
    if (Array.isArray(userStudents)) {
      return userStudents
        .map((item) => normalizeDashboardStudent(item))
        .filter((item): item is Record<string, unknown> => !!item);
    }

    const userStudent = normalizeDashboardStudent(user.student);
    if (userStudent) {
      return [userStudent];
    }
  }

  return [];
}

function normalizeDashboardNotifications(payload: Record<string, unknown>): NotificationItem[] {
  const rawList =
    (Array.isArray(payload.notifications) && payload.notifications) ||
    (Array.isArray(payload.recent_notifications) && payload.recent_notifications) ||
    [];

  return rawList.map((item, index) => {
    const rec = toRecord(item) ?? {};
    return {
      id: toNumber(rec.id, index + 1),
      title: (rec.title as string) ?? "",
      body: ((rec.body as string) ?? (rec.message as string) ?? ""),
      type: ((rec.type as NotificationItem["type"]) ?? "general"),
      is_read: Boolean(rec.is_read),
      created_at: (rec.created_at as string) ?? (rec.sent_at_iso as string) ?? new Date().toISOString(),
      data: toRecord(rec.data) ?? undefined,
    };
  });
}

function normalizeDashboardData(raw: unknown): DashboardData {
  const payload = toRecord(raw) ?? {};
  const attendance = toRecord(payload.attendance_summary) ?? {};
  const fees = toRecord(payload.fees_summary) ?? {};
  const exams = toRecord(payload.exam_results_summary) ?? {};
  const leave = toRecord(payload.leave_summary);

  return {
    students: normalizeDashboardStudents(payload),
    attendance_summary: {
      present: toNumber(attendance.present),
      absent: toNumber(attendance.absent),
      total: toNumber(attendance.total),
      percentage: toNumber(attendance.percentage),
    },
    fees_summary: {
      total: toNumber(fees.total),
      paid: toNumber(fees.paid),
      pending: toNumber(fees.pending),
    },
    exam_results_summary: {
      average: toNumber(exams.average),
      subjects: toNumber(exams.subjects),
      total_marks: toNumber(exams.total_marks),
      obtained_marks: toNumber(exams.obtained_marks),
    },
    notifications: normalizeDashboardNotifications(payload),
    leave_summary: leave
      ? {
          pending: toNumber(leave.pending),
          approved: toNumber(leave.approved),
          rejected: toNumber(leave.rejected),
          total: toNumber(leave.total),
        }
      : undefined,
  };
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await apiClient.get("/student/dashboard");

  const payload = unwrap<DashboardData | Record<string, unknown>>(res);
  return normalizeDashboardData(payload);
}

export async function fetchProfile(): Promise<Record<string, unknown>> {
  const res = await apiClient.get("/me");
  return unwrap(res);
}

// ─── Attendance ─────────────────────────────────────────────────────

export async function fetchAttendance(
  _studentUuid: string,
  month?: number,
  year?: number,
): Promise<AttendanceData> {
  const params: Record<string, string | number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const res = await apiClient.get("/student/attendance", { params });
  const payload = unwrap<AttendanceData | Record<string, unknown>>(res);
  const root = toRecord(payload) ?? {};
  const nested = pickObject(root, ["attendance", "data"]) ?? root;
  const records = pickArray<AttendanceRecord>(nested, ["records", "attendance_records", "items"]);
  const summary = pickObject(nested, ["summary", "attendance_summary"]) ?? { total_days: 0, counts: {} };
  return {
    student: (toRecord(nested.student) ?? {}) as Record<string, unknown>,
    month: toNumber(nested.month),
    year: toNumber(nested.year),
    summary: {
      total_days: toNumber(summary.total_days),
      counts: (toRecord(summary.counts) ?? {}) as Record<string, number>,
    },
    records,
  };
}

// ─── Fees ───────────────────────────────────────────────────────────

export async function fetchFees(studentUuid: string): Promise<StudentFee[]> {
  const res = await apiClient.get("/student/fees");
  const payload = unwrap<StudentFee[] | Record<string, unknown>>(res);
  if (Array.isArray(payload)) return payload;
  const root = toRecord(payload) ?? {};
  return pickArray<StudentFee>(root, ["fees", "items", "data"]);
}

// ─── Exam Results ───────────────────────────────────────────────────

export async function fetchExamResults(
  _studentUuid: string,
): Promise<{ student: Record<string, unknown>; results_by_academic_year: Record<string, ExamResultRecord[]> }> {
  const res = await apiClient.get("/student/results");
  const payload = unwrap<Record<string, unknown>>(res);
  const root = toRecord(payload) ?? {};
  const grouped: Record<string, ExamResultRecord[]> = {};

  const raw = root.results_by_academic_year ?? root.results;
  if (Array.isArray(raw)) {
    // Backend shape: [{ academic_year_id, results: [...] }, ...]
    for (const group of raw) {
      const g = toRecord(group);
      if (!g) continue;
      const key = String(g.academic_year_id ?? "Unknown");
      grouped[key] = toArray<ExamResultRecord>(g.results);
    }
  } else {
    // Backend shape: { "<yearId>": [result, ...], ... }
    const obj = toRecord(raw);
    if (obj) {
      for (const [key, value] of Object.entries(obj)) {
        grouped[key] = toArray<ExamResultRecord>(value);
      }
    }
  }

  return {
    student: (toRecord(root.student) ?? {}) as Record<string, unknown>,
    results_by_academic_year: grouped,
  };
}

// ─── Timetable ──────────────────────────────────────────────────────

export async function fetchTimetable(studentUuid: string): Promise<{ timetable: TimetableData }> {
  const res = await apiClient.get("/student/timetable");
  const payload = unwrap<Record<string, unknown>>(res);
  const root = toRecord(payload) ?? {};
  const timetable: TimetableData = {};

  // Backend shape: [{ day_of_week, day_name, slots: [...] }, ...] → key by day number
  const rawDays = toArray<Record<string, unknown>>(root.timetable ?? root.schedule);
  for (const day of rawDays) {
    const dayRec = toRecord(day);
    if (!dayRec) continue;
    const dow = dayRec.day_of_week;
    const key = typeof dow === "number" ? String(dow) : typeof dow === "string" ? dow : "";
    if (!key) continue;
    timetable[key] = toArray<TimetableSlot>(dayRec.slots);
  }

  return { timetable };
}

// ─── Me ─────────────────────────────────────────────────────────────

export async function fetchMe(): Promise<{
  user: Record<string, unknown>;
  roles: string[];
  permissions: string[];
  students?: Record<string, unknown>[];
  student_uuid?: string;
}> {
  const res = await apiClient.get("/me");
  return unwrap(res);
}

// ─── Notifications ──────────────────────────────────────────────────

const NOTIFICATION_TYPE_MAP: Record<string, NotificationItem["type"]> = {
  attendance_alert: "attendance",
  fee_reminder: "fees",
  exam_result_alert: "result",
  announcement: "general",
  timetable_update: "general",
};

function normalizeNotification(raw: Record<string, unknown>): NotificationItem {
  if (!raw || typeof raw !== "object") {
    return {
      id: 0,
      title: "",
      body: "",
      type: "general",
      is_read: false,
      created_at: "",
      data: undefined,
    };
  }
  const rawId = raw.id;
  return {
    id: typeof rawId === "number" ? rawId : typeof rawId === "string" ? parseInt(rawId, 10) || 0 : 0,
    title: (raw.title as string) ?? "",
    body: ((raw.body as string) ?? (raw.message as string) ?? ""),
    type: NOTIFICATION_TYPE_MAP[raw.type as string] ?? "general",
    is_read: (raw.is_read as boolean) ?? false,
    created_at: (raw.created_at as string) ?? (raw.sent_at_iso as string) ?? "",
    data: raw.data as Record<string, unknown> | undefined,
  };
}

export async function fetchNotifications(page = 1): Promise<{
  data: NotificationItem[];
  meta: { current_page: number; last_page: number; total: number };
}> {
  const res = await apiClient.get("/student/notifications", { params: { page } });
  const body = unwrap<Record<string, unknown>>(res);
  const rawItems = pickArray<Record<string, unknown>>(body, ["data", "notifications", "items"]);
  const meta = pickObject(body, ["meta", "pagination"]) ?? {};
  return {
    data: rawItems.map(normalizeNotification),
    meta: {
      current_page: toNumber(meta.current_page, 1),
      last_page: toNumber(meta.last_page, 1),
      total: toNumber(meta.total, rawItems.length),
    },
  };
}

export async function fetchNotificationDetail(id: number): Promise<NotificationItem> {
  const res = await apiClient.get(`/student/notifications/${id}`);
  const payload = unwrap<Record<string, unknown>>(res);
  return normalizeNotification(toRecord(payload) ?? {});
}

export async function fetchUnreadCount(): Promise<{ count: number }> {
  const res = await apiClient.get("/student/notifications/unread");
  const data = unwrap<Record<string, unknown>>(res);
  return { count: toNumber(data.unread_count ?? data.count) };
}

export async function markNotificationRead(id: number): Promise<void> {
  await unwrap<void>(await apiClient.post(`/student/notifications/${id}/read`));
}

export async function markAllNotificationsRead(): Promise<void> {
  await unwrap<void>(await apiClient.post("/student/notifications/read-all"));
}

// ─── Homework ───────────────────────────────────────────────────────

export async function fetchHomework(_studentUuid: string): Promise<HomeworkItem[]> {
  const res = await apiClient.get("/student/homework");
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<HomeworkItem>(payload, ["homework", "items", "data"]);
}

// ─── Assignments ───────────────────────────────────────────────────

export async function fetchAssignments(_studentUuid: string): Promise<AssignmentItem[]> {
  const res = await apiClient.get("/student/assignments");
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<AssignmentItem>(payload, ["assignments", "items", "data"]);
}

// ─── Exam Schedule ─────────────────────────────────────────────────

export async function fetchExamSchedule(_studentUuid: string): Promise<ExamScheduleItem[]> {
  const res = await apiClient.get("/student/exam-schedule");
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<ExamScheduleItem>(payload, ["schedules", "exam_schedule", "items", "data"]);
}

// ─── Academic Calendar ──────────────────────────────────────────────

export async function fetchCalendar(
  _studentUuid: string,
  month?: number,
  year?: number,
  eventType?: string,
): Promise<CalendarEvent[]> {
  const params: Record<string, string | number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  if (eventType) params.type = eventType;
  const res = await apiClient.get("/student/calendar", { params });
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<CalendarEvent>(payload, ["events", "calendar", "items", "data"]);
}

// ─── Student Documents ──────────────────────────────────────────────

export async function fetchDocuments(_studentUuid: string): Promise<StudentDocument[]> {
  const res = await apiClient.get("/student/documents");
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<StudentDocument>(payload, ["documents", "items", "data"]);
}

// ─── Circulars / Announcements ────────────────────────────────────

export async function fetchCirculars(page = 1): Promise<{
  data: CircularItem[];
  meta: { current_page: number; last_page: number; total: number };
}> {
  const res = await apiClient.get("/student/circulars", { params: { page } });
  const body = unwrap<Record<string, unknown>>(res);
  const meta = pickObject(body, ["meta", "pagination"]) ?? {};
  return {
    data: pickArray<CircularItem>(body, ["data", "circulars", "items"]),
    meta: {
      current_page: toNumber(meta.current_page, 1),
      last_page: toNumber(meta.last_page, 1),
      total: toNumber(meta.total, 0),
    },
  };
}

export async function fetchCircularDetail(id: number): Promise<CircularItem> {
  const res = await apiClient.get(`/student/circulars/${id}`);
  return unwrap<CircularItem>(res);
}

export async function markCircularRead(id: number): Promise<void> {
  await unwrap<void>(await apiClient.post(`/student/circulars/${id}/read`));
}

// ─── Leave Requests ─────────────────────────────────────────────────

export async function fetchLeaveRequests(_studentUuid: string): Promise<LeaveRequest[]> {
  const res = await apiClient.get("/student/leave-requests");
  const payload = unwrap<Record<string, unknown>>(res);
  return pickArray<LeaveRequest>(payload, ["leave_requests", "leaves", "items", "data"]);
}

export async function fetchLeaveRequestDetail(_studentUuid: string, id: number): Promise<LeaveRequest> {
  const res = await apiClient.get(`/student/leave-requests/${id}`);
  const payload = unwrap<Record<string, unknown>>(res);
  return ((pickObject(payload, ["leave_request", "leave", "data"]) ?? {}) as unknown) as LeaveRequest;
}

export async function submitLeaveRequest(_studentUuid: string, payload: LeaveRequestPayload): Promise<LeaveRequest> {
  const res = await apiClient.post("/student/leave-requests", payload);
  const body = unwrap<Record<string, unknown>>(res);
  return ((pickObject(body, ["leave_request", "leave", "data"]) ?? {}) as unknown) as LeaveRequest;
}

export async function updateLeaveRequest(_studentUuid: string, id: number, payload: Partial<LeaveRequestPayload>): Promise<LeaveRequest> {
  const res = await apiClient.put(`/student/leave-requests/${id}`, payload);
  const body = unwrap<Record<string, unknown>>(res);
  return ((pickObject(body, ["leave_request", "leave", "data"]) ?? {}) as unknown) as LeaveRequest;
}

// ─── Profile ────────────────────────────────────────────────────────

export interface ProfileUpdatePayload {
  phone?: string;
  email?: string;
  address?: string;
  profile_photo?: string;
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<Record<string, unknown>> {
  const res = await apiClient.put(`/me`, payload);
  return unwrap(res);
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<Record<string, unknown>> {
  const res = await apiClient.put(`/me/change-password`, payload);
   return unwrap<Record<string, unknown>>(res);
}

// ─── Transport ──────────────────────────────────────────────

export async function fetchTransportDashboard(_studentUuid: string): Promise<TransportDashboardData> {
   const res = await apiClient.get("/student/transport");
   const body = unwrap<Record<string, unknown>>(res);
   return {
     transport: ((toRecord(body.transport) ?? toRecord(body.data) ?? null) as unknown as TransportData | null),
     stops: pickArray<TransportStop>(body, ["stops", "route_stops", "items"]),
   };
 }

export default apiClient;

function isDateToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export async function fetchDashboardHighlights(studentUuid: string): Promise<DashboardHighlights> {
  const [timetableRes, homeworkRes, examRes, transportRes, noticesRes] = await Promise.allSettled([
    fetchTimetable(studentUuid),
    fetchHomework(studentUuid),
    fetchExamSchedule(studentUuid),
    fetchTransportDashboard(studentUuid),
    fetchNotifications(),
  ]);

  const timetable = timetableRes.status === "fulfilled" ? timetableRes.value.timetable : {};
  const homework = homeworkRes.status === "fulfilled" ? homeworkRes.value : [];
  const exams = examRes.status === "fulfilled" ? examRes.value : [];
  const transport = transportRes.status === "fulfilled" ? transportRes.value : null;
  const notices = noticesRes.status === "fulfilled" ? noticesRes.value.data : [];

  const upcoming = exams
    .filter((e) => new Date(e.exam_date).getTime() >= Date.now() - 86400000)
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0] ?? null;

  return {
    timetable,
    homeworkDueToday: homework.filter((h) => isDateToday(h.due_date)).length,
    upcomingExam: upcoming,
    unreadNotices: notices.filter((n) => !n.is_read).length,
    busEnabled: transport != null && transport.transport != null,
    busActive: transport != null && transport.transport?.status === "active",
  };
}