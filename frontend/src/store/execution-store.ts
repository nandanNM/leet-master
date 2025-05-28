import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { SubmissionValues } from "@/lib/validations";

interface ExecutionState {
  isExecuting: boolean;
  submission: SubmissionValues | null;
  executeCode: (data: SubmissionValues) => Promise<void>;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isExecuting: false,
  submission: null,
  executeCode: async (data: SubmissionValues) => {
    try {
      set({ isExecuting: true });
      console.log("Submission:", JSON.stringify(data));
      const res = (await axiosInstance.post("/execute-code", data)).data;
      set({ submission: res.data });
      toast.success(res.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isExecuting: false });
    }
  },
}));
