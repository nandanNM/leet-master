import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
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
export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyy");
    }
  }
}

export function capitalizeWords(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
