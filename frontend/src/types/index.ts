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
  avatar?: string;
  bio?: string;
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

export type EditorStore = {
  language: string;
  theme: string;
  fontSize: number;
  code: string;
  editor: Monaco | null;

  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  setCode: (code: string) => void;
  setEditor: (editor: Monaco) => void;
};
export type LanguageKey = "JAVASCRIPT" | "PYTHON" | "JAVA";
export type LanguageConfig = Record<
  LanguageKey,
  {
    id: string;
    label: string;
    logoPath: string;

    monacoLanguage: string;
  }
>;
export interface Theme {
  id: string;
  label: string;
  color: string;
}
