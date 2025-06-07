import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { SubmissionResponse } from "@/lib/validations";
import type { SubmissionHeatmapEntry, UserSubmissionStats } from "@/types";
interface SubmissionState {
  isLoading: boolean;
  submissions: SubmissionResponse[];
  submissionsForProblem: SubmissionResponse[];
  submissionCount: {
    submissionCount: number;
    successRate: number;
  } | null;
  submissionStats: UserSubmissionStats | null;
  isSubmissionStatsLoading: boolean;

  hetmapData: SubmissionHeatmapEntry[];
  isHetmapLoading: boolean;
  hetmapError: string | null;
  getHeatmapData: () => Promise<void>;

  getAllSubmissions: () => Promise<void>;
  getSubmissionForProblem: (problemId: string) => Promise<void>;
  getSubmissionCountForProblem: (problemId: string) => Promise<void>;
  getSubmissionStats: () => Promise<void>;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  isLoading: false,
  submissions: [],
  submissionsForProblem: [],
  submissionCount: null,
  submissionStats: null,
  isSubmissionStatsLoading: false,
  hetmapData: [],
  isHetmapLoading: false,
  hetmapError: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.get("/submission/get-all-submissions"))
        .data;
      set({
        submissions: res.data,
        isLoading: false,
      });

      // toast.success(res.message);
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
      // console.log("this is res", res);
      set({
        submissionsForProblem: res.data,
        isLoading: false,
      });
    } catch (error) {
      console.log("Error getting submissions for problem", error);
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
  getSubmissionStats: async () => {
    try {
      set({ isSubmissionStatsLoading: true });
      const res = (await axiosInstance.get("/submission/submission-stats"))
        .data;
      set({
        submissionStats: res.data,
        isSubmissionStatsLoading: false,
      });
    } catch (error) {
      console.log("Error getting submission stats", error);
      toast.error(getErrorMessage(error));
      set({ isSubmissionStatsLoading: false });
    }
  },
  getHeatmapData: async () => {
    try {
      set({ isHetmapLoading: true });
      const res = (await axiosInstance.get("/submission/heatmap")).data;
      set({
        hetmapData: res.data,
        isHetmapLoading: false,
      });
    } catch (error) {
      console.log("Error getting heatmap data", error);
      toast.error(getErrorMessage(error));
      set({ isHetmapLoading: false });
    }
  },
}));
