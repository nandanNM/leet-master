import { create } from "zustand";
import type { editor } from "monaco-editor";
import type { LanguageKey } from "@/types";
import { toast } from "sonner";

// Language keys in UPPERCASE format

type CodeEditorState = {
  language: LanguageKey;
  theme: string;
  fontSize: number;
  editor: editor.IStandaloneCodeEditor | null;

  getCode: () => string;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setLanguage: (language: LanguageKey, problemId?: string) => void;
  clearProblemCode: (problemId: string) => void;
  clearAllProblemCode: () => void;
};

// Ensures all values returned are valid and typed correctly
const getInitialState = (): {
  language: LanguageKey;
  theme: string;
  fontSize: number;
} => {
  if (typeof window === "undefined") {
    return {
      language: "JAVASCRIPT",
      theme: "vs-dark",
      fontSize: 16,
    };
  }

  const savedLanguage = (localStorage
    .getItem("editor-language")
    ?.toUpperCase() || "JAVASCRIPT") as LanguageKey;
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = Number(localStorage.getItem("editor-font-size")) || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: savedFontSize,
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    editor: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editorInstance: editor.IStandaloneCodeEditor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) {
        editorInstance.setValue(savedCode);
      }
      set({ editor: editorInstance });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: LanguageKey, problemId?: string) => {
      // Save current code before switching languages
      const currentCode = get().editor?.getValue();
      const currentLanguage = get().language;

      if (currentCode && problemId) {
        localStorage.setItem(
          `editor-code-${problemId}-${currentLanguage}`,
          currentCode,
        );
      }

      // Load saved code for new language (if any)
      if (problemId) {
        const savedCode = localStorage.getItem(
          `editor-code-${problemId}-${language}`,
        );
        if (savedCode && get().editor) {
          get().editor?.setValue(savedCode);
        }
      }

      localStorage.setItem("editor-language", language);
      set({ language });
    },

    clearProblemCode: (problemId: string) => {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`editor-code-${problemId}-`)) {
          localStorage.removeItem(key);
        }
      });
    },

    clearAllProblemCode: () => {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("editor-code-")) {
          localStorage.removeItem(key);
        }
      });
      toast.success(
        "✨ Poof! All saved problem codes vanished from local storage!",
      );
    },
  };
});
