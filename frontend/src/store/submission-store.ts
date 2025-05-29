import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { SubmissionResponse } from "@/lib/validations";

interface SubmissionState {
  isLoading: boolean;
  submissions: SubmissionResponse[];
  submissionsForProblem: SubmissionResponse[];
  submissionCount: number | null;

  getAllSubmissions: () => Promise<void>;
  getSubmissionForProblem: (problemId: string) => Promise<void>;
  getSubmissionCountForProblem: (problemId: string) => Promise<void>;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  isLoading: false,
  submissions: [],
  submissionsForProblem: [],
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.get("/submission/get-all-submissions"))
        .data;
      set({
        submissions: res.data,
        isLoading: false,
      });

      toast.success(res.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error(getErrorMessage(error));
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId: string) => {
    try {
      set({ isLoading: true });
      const res = (
        await axiosInstance.get(`/submission/get-submissions/${problemId}`)
      ).data;
      console.log("this is res", res);
      set({
        submissionsForProblem: res.data,
        isLoading: false,
      });
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error(getErrorMessage(error));
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId: string) => {
    try {
      set({ isLoading: true });
      const res = (
        await axiosInstance.get(
          `/submission/get-submissions-count/${problemId}`,
        )
      ).data;

      set({
        submissionCount: res.data,
        isLoading: false,
      });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error(getErrorMessage(error));
      set({ isLoading: false });
    }
  },
}));
