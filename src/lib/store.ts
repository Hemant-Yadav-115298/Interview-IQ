"use client";

import { create } from "zustand";
import { useMemo } from "react";
import { Question, Filters, ARCHIVE_THRESHOLD } from "./types";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";
import { toast } from "sonner";

interface StoreState {
  questions: Question[];
  filters: Filters;
  searchQuery: string;
  adminAuthenticated: boolean;
  adminPin: string;
  initialized: boolean;
  isLoading: boolean;

  // Actions
  initializeStore: () => Promise<void>;
  addQuestion: (q: Omit<Question, "id" | "askCount" | "status" | "createdAt">) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  incrementAskCount: (id: string) => Promise<string | null>;
  restoreQuestion: (id: string) => Promise<void>;
  bulkImport: (questions: Omit<Question, "id" | "askCount" | "status" | "createdAt">[]) => Promise<number>;
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

export const useStore = create<StoreState>()((set, get) => ({
  questions: [],
  filters: defaultFilters,
  searchQuery: "",
  adminAuthenticated: false,
  // Hardcoded for demo, normally this would be in env or DB
  adminPin: "1234",
  initialized: false,
  isLoading: true,

  initializeStore: async () => {
    const state = get();
    if (state.initialized) return;

    set({ isLoading: true });

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching questions from Supabase:", error);
      toast.error("Failed to fetch questions from database.");
      set({ isLoading: false });
      return;
    }

    set({ questions: data as Question[], initialized: true, isLoading: false });
  },

  addQuestion: async (q) => {
    const newQuestion: Question = {
      ...q,
      id: uuidv4(),
      askCount: 0,
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    
    // Optimistic UI update
    set((state) => ({ questions: [newQuestion, ...state.questions] }));

    // Supabase DB insert
    const { error } = await supabase.from("questions").insert(newQuestion);
    if (error) {
      console.error("Error inserting question:", error);
      toast.error("Failed to save question to database.");
      // Rollback optimistic update
      set((state) => ({ questions: state.questions.filter((item) => item.id !== newQuestion.id) }));
    }
  },

  updateQuestion: async (id, updates) => {
    // Optimistic UI update
    const previousQuestions = get().questions;
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));

    // Supabase DB update
    const { error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", id);
      
    if (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question in database.");
      set({ questions: previousQuestions }); // Rollback
    }
  },

  deleteQuestion: async (id) => {
    const previousQuestions = get().questions;
    
    // Optimistic UI update
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    }));

    // Supabase DB delete
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question from database.");
      set({ questions: previousQuestions }); // Rollback
    }
  },

  incrementAskCount: async (id) => {
    let archived: string | null = null;
    let updatePayload: Partial<Question> = {};

    // Optimistic UI update
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id === id) {
          const newCount = q.askCount + 1;
          const newStatus = newCount >= ARCHIVE_THRESHOLD ? "Archived" : q.status;
          
          if (newStatus === "Archived" && q.status !== "Archived") {
            archived = "archived";
          }
          
          updatePayload = { askCount: newCount, status: newStatus };
          return { ...q, ...updatePayload };
        }
        return q;
      }),
    }));

    // Supabase DB update
    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabase.from("questions").update(updatePayload).eq("id", id);
      if (error) {
        console.error("Error updating ask count:", error);
        toast.error("Failed to update ask count in database.");
      }
    }

    return archived;
  },

  restoreQuestion: async (id) => {
    const updatePayload: Partial<Question> = { status: "Active", askCount: 0 };
    
    // Optimistic UI update
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updatePayload } : q
      ),
    }));

    // Supabase DB update
    const { error } = await supabase.from("questions").update(updatePayload).eq("id", id);
    if (error) {
      console.error("Error restoring question:", error);
      toast.error("Failed to restore question in database.");
    }
  },

  bulkImport: async (questions) => {
    const newQuestions: Question[] = questions.map((q) => ({
      ...q,
      id: uuidv4(),
      askCount: 0,
      status: "Active" as const,
      createdAt: new Date().toISOString(),
    }));
    
    // Optimistic UI update
    set((state) => ({ questions: [...newQuestions, ...state.questions] }));

    // Supabase DB insert
    const { error } = await supabase.from("questions").insert(newQuestions);
    if (error) {
      console.error("Error bulk importing questions:", error);
      toast.error("Failed to bulk import questions into database.");
      // Note: Full rollback for bulk is tricky if partial inserts occur, 
      // but assuming atomic insert fails completely:
      set((state) => ({ 
        questions: state.questions.filter((q) => !newQuestions.find(nq => nq.id === q.id)) 
      }));
      return 0;
    }

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
}));

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
