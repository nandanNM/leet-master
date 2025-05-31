import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type {
  SubmissionValues,
  SubmissionWithTestCases,
} from "@/lib/validations";

interface ExecutionState {
  isExecuting: boolean;
  isSubmitting: boolean;
  submission: SubmissionWithTestCases | null;
  submitCode: (data: SubmissionValues) => Promise<void>;
  runCode: (data: SubmissionValues) => Promise<void>;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isExecuting: false,
  submission: null,
  isSubmitting: false,
  submitCode: async (data: SubmissionValues) => {
    try {
      set({ isSubmitting: true });
      console.log("Submission:", JSON.stringify(data));
      const res = (await axiosInstance.post("/execute-code/submit-code", data))
        .data;
      set({ submission: res.data });
      toast.success(res.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSubmitting: false });
    }
  },
  runCode: async (data: SubmissionValues) => {
    try {
      set({ isExecuting: true });
      console.log("Running code:", JSON.stringify(data));
      const res = (await axiosInstance.post("/execute-code/run-code", data))
        .data;
      set({ submission: res.data });
      toast.success("🧪 Test cases executed successfully!");
    } catch (error) {
      console.error("Error running code", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isExecuting: false });
    }
  },
}));
