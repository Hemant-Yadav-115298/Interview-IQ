"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { Question, Filters, ARCHIVE_THRESHOLD } from "./types";
import { seedQuestions } from "./seed-data";
import { v4 as uuidv4 } from "uuid";

interface StoreState {
  questions: Question[];
  filters: Filters;
  searchQuery: string;
  adminAuthenticated: boolean;
  adminPin: string;
  initialized: boolean;

  // Actions
  initializeStore: () => void;
  addQuestion: (q: Omit<Question, "id" | "askCount" | "status" | "createdAt">) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  incrementAskCount: (id: string) => string | null;
  restoreQuestion: (id: string) => void;
  bulkImport: (questions: Omit<Question, "id" | "askCount" | "status" | "createdAt">[]) => number;
  toggleFilter: (key: keyof Filters, value: string) => void;
  removeFilter: (key: keyof Filters, value: string) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
}

const defaultFilters: Filters = {
  language: [],
  framework: [],
  experience: [],
  difficulty: [],
  type: [],
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      questions: [],
      filters: defaultFilters,
      searchQuery: "",
      adminAuthenticated: false,
      adminPin: "1234",
      initialized: false,

      initializeStore: () => {
        const state = get();
        if (!state.initialized || state.questions.length === 0) {
          set({ questions: seedQuestions, initialized: true });
        }
      },

      addQuestion: (q) => {
        const newQuestion: Question = {
          ...q,
          id: uuidv4(),
          askCount: 0,
          status: "Active",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ questions: [...state.questions, newQuestion] }));
      },

      updateQuestion: (id, updates) => {
        set((state) => ({
          questions: state.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        }));
      },

      deleteQuestion: (id) => {
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        }));
      },

      incrementAskCount: (id) => {
        let archived: string | null = null;
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === id) {
              const newCount = q.askCount + 1;
              const newStatus = newCount >= ARCHIVE_THRESHOLD ? "Archived" : q.status;
              if (newStatus === "Archived" && q.status !== "Archived") {
                archived = "archived";
              }
              return { ...q, askCount: newCount, status: newStatus };
            }
            return q;
          }),
        }));
        return archived;
      },

      restoreQuestion: (id) => {
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, status: "Active" as const, askCount: 0 } : q
          ),
        }));
      },

      bulkImport: (questions) => {
        const newQuestions: Question[] = questions.map((q) => ({
          ...q,
          id: uuidv4(),
          askCount: 0,
          status: "Active" as const,
          createdAt: new Date().toISOString(),
        }));
        set((state) => ({ questions: [...state.questions, ...newQuestions] }));
        return newQuestions.length;
      },

      toggleFilter: (key, value) => {
        set((state) => {
          const current = state.filters[key];
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
          return { filters: { ...state.filters, [key]: next } };
        });
      },

      removeFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: state.filters[key].filter((v) => v !== value),
          },
        }));
      },

      clearFilters: () => {
        set({ filters: defaultFilters });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      authenticateAdmin: (pin) => {
        const state = get();
        if (pin === state.adminPin) {
          set({ adminAuthenticated: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => {
        set({ adminAuthenticated: false });
      },
    }),
    {
      name: "interview-guide-storage",
      partialize: (state) => ({
        questions: state.questions,
        initialized: state.initialized,
        adminPin: state.adminPin,
      }),
    }
  )
);

// Helper function for filtering questions
function filterQuestions(
  questions: Question[],
  filters: Filters,
  searchQuery: string,
  status: "Active" | "Archived"
): Question[] {
  let result = questions.filter((q) => q.status === status);

  const { language, framework, experience, difficulty, type } = filters;
  if (language.length) result = result.filter((q) => language.includes(q.language));
  if (framework.length) result = result.filter((q) => framework.includes(q.framework));
  if (experience.length) result = result.filter((q) => experience.includes(q.experience));
  if (difficulty.length) result = result.filter((q) => difficulty.includes(q.difficulty));
  if (type.length) result = result.filter((q) => type.includes(q.type));

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (q) =>
        q.content.toLowerCase().includes(query) ||
        q.language.toLowerCase().includes(query) ||
        q.framework.toLowerCase().includes(query) ||
        (q.tags && q.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }

  return result;
}

// Hooks that use useMemo to stabilize derived data
export function useActiveQuestions(): Question[] {
  const questions = useStore((s) => s.questions);
  const filters = useStore((s) => s.filters);
  const searchQuery = useStore((s) => s.searchQuery);

  return useMemo(
    () => filterQuestions(questions, filters, searchQuery, "Active"),
    [questions, filters, searchQuery]
  );
}

export function useArchivedQuestions(): Question[] {
  const questions = useStore((s) => s.questions);
  const searchQuery = useStore((s) => s.searchQuery);
  const filters = useStore((s) => s.filters);

  return useMemo(
    () => filterQuestions(questions, filters, searchQuery, "Archived"),
    [questions, filters, searchQuery]
  );
}

export function useStats() {
  const questions = useStore((s) => s.questions);

  return useMemo(() => {
    const total = questions.length;
    const active = questions.filter((q) => q.status === "Active").length;
    const archived = questions.filter((q) => q.status === "Archived").length;
    const mcq = questions.filter((q) => q.type === "MCQ" && q.status === "Active").length;
    const theory = questions.filter((q) => q.type === "Theory" && q.status === "Active").length;
    const code = questions.filter((q) => q.type === "Code" && q.status === "Active").length;
    return { total, active, archived, mcq, theory, code };
  }, [questions]);
}

// Helper: get all active filter entries as flat list for badges
export function useActiveFilterEntries() {
  const filters = useStore((s) => s.filters);
  return useMemo(() => {
    const entries: { key: keyof Filters; value: string; label: string }[] = [];
    const labelMap: Record<keyof Filters, string> = {
      language: "Language",
      framework: "Framework",
      experience: "Experience",
      difficulty: "Difficulty",
      type: "Type",
    };
    (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
      filters[key].forEach((value) => {
        entries.push({ key, value, label: `${labelMap[key]}: ${value}` });
      });
    });
    return entries;
  }, [filters]);
}
