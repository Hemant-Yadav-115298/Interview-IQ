"use client";

import { useActiveQuestions } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { StatsCards } from "@/components/stats-cards";
import { FilterPanel } from "@/components/filter-panel";
import { QuestionCard } from "@/components/question-card";
import { Inbox } from "lucide-react";

export default function DashboardPage() {
  const questions = useActiveQuestions();

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Stats */}
        <StatsCards />

        {/* Filters */}
        <FilterPanel />

        {/* Question List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Active Questions ({questions.length})
            </h3>
          </div>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-semibold mb-1">No questions found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your filters or search query. You can add new questions from the Admin portal.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
