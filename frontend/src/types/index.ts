import { type Monaco } from "@monaco-editor/react";

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}
export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
  theme: string;
  fontSize: number;
  editor: Monaco | null;
  executionResult: ExecutionResult | null;

  setEditor: (editor: Monaco) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avater?: string;
  role: "ADMIN" | "USER";
};
export type UserSubmissionStats = {
  totalSubmissions: number;
  submissionsLast24Hours: number;
};
export type SubmissionHeatmapEntry = {
  date: string; // Format: YYYY-MM-DD
  count: number;
};
