import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, Student, LoginPayload, LoginResponse, AuthState } from "@/types";

interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;
  setStudents: (students: Student[]) => void;
  setLoading: (loading: boolean) => void;
  hydrateFromApi: (data: LoginResponse) => void;
  setStudentUuid: (uuid: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      students: [],
      token: null,
      isAuthenticated: false,
      isLoading: false,
      studentUuid: null,

      login: async (_payload: LoginPayload) => {
        set({ isLoading: true });
        set({ isLoading: false });
      },

      logout: () => {
        set({
          user: null,
          students: [],
          token: null,
          isAuthenticated: false,
          studentUuid: null,
        });
      },

      setUser: (user: User) => set({ user }),

      setToken: (token: string | null) =>
        set({ token, isAuthenticated: !!token }),

      setStudents: (students: Student[]) => set({ students }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      hydrateFromApi: (data: LoginResponse) =>
        set({
          user: data.user,
          students: data.students,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          studentUuid: data.student_uuid ?? data.students?.[0]?.uuid ?? null,
        }),

      setStudentUuid: (uuid: string | null) => set({ studentUuid: uuid }),
    }),
    {
      name: "school_student_auth_store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        students: state.students,
        isAuthenticated: state.isAuthenticated,
        studentUuid: state.studentUuid,
      }),
    },
  ),
);
