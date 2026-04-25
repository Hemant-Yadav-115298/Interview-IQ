"use client";

import { useArchivedQuestions } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { QuestionCard } from "@/components/question-card";
import { Archive } from "lucide-react";

export default function ArchivePage() {
  const questions = useArchivedQuestions();

  return (
    <AppShell title="Archived Questions">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <Archive className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Archived Questions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Questions that have reached 15 asks are automatically archived here. You can restore them to reset their ask count and return them to the active pool.
            </p>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <Archive className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold mb-1">No archived questions</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Questions will automatically appear here once they reach 15 asks.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="text-sm font-semibold text-muted-foreground">
              {questions.length} archived question{questions.length !== 1 ? "s" : ""}
            </p>
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} showRestore />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
