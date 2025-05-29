import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { Difficulty } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export function getLanguageName(languageId: number): string {
  const LANGUAGE_NAMES: Record<number, string> = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export function getLanguageId(language: string): number {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TYPESCRIPT: 74,
  };
  return languageMap[language.toUpperCase()];
}

export const safeParse = <T>(data: string | T[]): T[] => {
  if (Array.isArray(data)) return data;
  try {
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
};
export const calculateAverageMemory = (
  memoryData: string[] | string,
): number => {
  const memoryArray = safeParse<string>(memoryData).map((m) => {
    const value = parseFloat(m.split(" ")[0]);
    return isNaN(value) ? 0 : value;
  });

  if (memoryArray.length === 0) return 0;
  return memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length;
};

export const calculateAverageTime = (timeData: string[] | string): number => {
  const timeArray = safeParse<string>(timeData).map((t) => {
    const value = parseFloat(t.split(" ")[0]);
    return isNaN(value) ? 0 : value;
  });

  if (timeArray.length === 0) return 0;
  return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
};

export const formatRelativeTime = (date: string | Date | number): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 120) return "1m ago";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 7200) return "1h ago";
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "yesterday";

  return inputDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export function capitalizeWords(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
