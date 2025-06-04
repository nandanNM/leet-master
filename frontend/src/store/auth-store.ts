import { create } from "zustand";
import { persist } from "zustand/middleware"; // <- import persist
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { AuthUser } from "@/types";
import type { UpdateUserProfileValues } from "@/lib/validations";

type LoginData = { email: string; password: string };
type SignupData = { name: string; email: string; password: string };

interface AuthState {
  authUser: AuthUser | null;
  isSigninUp: boolean;
  isLoggingIn: boolean;
  isFetchingUser: boolean;
  isAuthenticated: boolean;
  isUpdatingUser: boolean;
  getCurrentUser: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileValues) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      isSigninUp: false,
      isLoggingIn: false,
      isFetchingUser: false,
      isAuthenticated: false,
      isUpdatingUser: false,

      getCurrentUser: async () => {
        set({ isFetchingUser: true });
        try {
          const res = (await axiosInstance.get("/auth/current-user")).data;
          set({ authUser: res.data, isAuthenticated: true });
        } catch (error) {
          console.log(error);
          set({ authUser: null, isAuthenticated: false });
        } finally {
          set({ isFetchingUser: false });
        }
      },

      signup: async (data) => {
        set({ isSigninUp: true });
        try {
          const res = (await axiosInstance.post("/auth/register", data)).data;
          set({ authUser: res.data, isAuthenticated: true });
          toast.success(res.message);
        } catch (error) {
          toast.error(getErrorMessage(error));
        } finally {
          set({ isSigninUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = (await axiosInstance.post("/auth/login", data)).data;
          set({ authUser: res.data.user, isAuthenticated: true });
          toast.success(res.message);
        } catch (error) {
          toast.error(getErrorMessage(error));
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null, isAuthenticated: false });
          toast.success("Logout successful");
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingUser: true });
        try {
          const res = (
            await axiosInstance.post("/auth/update", data, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          ).data;
          set({ authUser: res.data, isAuthenticated: true });
          toast.success(res.message);
        } catch (error) {
          toast.error(getErrorMessage(error));
        } finally {
          set({ isUpdatingUser: false });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
