"use client";

import { Question, ARCHIVE_THRESHOLD } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CodeDisplay } from "@/components/code-display";
import {
  Copy,
  Check,
  Hand,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
  CircleDot,
  RotateCcw,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  showRestore?: boolean;
}

const typeIcons = {
  MCQ: CircleDot,
  Theory: FileText,
  Code: Code2,
};

const difficultyConfig = {
  Easy: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: "🟢" },
  Medium: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: "🟡" },
  Hard: { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", icon: "🔴" },
};

const typeColors = {
  MCQ: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Theory: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Code: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};

const typeGradient = {
  MCQ: "from-blue-500/5 to-cyan-500/5",
  Theory: "from-purple-500/5 to-pink-500/5",
  Code: "from-cyan-500/5 to-teal-500/5",
};

export function QuestionCard({ question, showRestore = false }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const incrementAskCount = useStore((s) => s.incrementAskCount);
  const restoreQuestion = useStore((s) => s.restoreQuestion);

  const TypeIcon = typeIcons[question.type];
  const progress = (question.askCount / ARCHIVE_THRESHOLD) * 100;
  const isNearArchive = question.askCount >= 12;

  const handleMarkAsked = async () => {
    const result = await incrementAskCount(question.id);
    if (result === "archived") {
      toast.success("Question Archived", {
        description: `"${question.content.substring(0, 50)}..." has reached ${ARCHIVE_THRESHOLD} asks and was automatically archived.`,
        icon: <Sparkles className="h-4 w-4" />,
      });
    } else {
      toast.info("Ask Count Updated", {
        description: `Ask count: ${question.askCount + 1}/${ARCHIVE_THRESHOLD}`,
      });
    }
  };

  const handleCopy = async () => {
    const text = `Question: ${question.content}\n\nType: ${question.type}\nLanguage: ${question.language}\nDifficulty: ${question.difficulty}${question.codeSnippet ? `\n\nCode:\n${question.codeSnippet}` : ""}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestore = () => {
    restoreQuestion(question.id);
    toast.success("Question Restored", {
      description: "The question has been moved back to active questions with reset ask count.",
    });
  };

  return (
    <Card className={cn(
      "group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border-border/40 overflow-hidden relative gap-0 bg-card/80 backdrop-blur-md",
      isNearArchive && !showRestore && "border-red-500/30 hover:shadow-red-500/10 shadow-[0_4px_20px_-10px_rgba(239,68,68,0.1)]",
      !isNearArchive && "hover:shadow-violet-500/10 shadow-[0_4px_20px_-10px_rgba(139,92,246,0.05)]"
    )}>
      {/* Type gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500", typeGradient[question.type])} />

      <CardContent className="p-0 relative">
        {/* Progress bar at top */}
        {!showRestore && (
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Ask Progress
                {/* Near-archive pulse indicator */}
                {isNearArchive && !showRestore && (
                  <div className="ml-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse">
                      <Zap className="h-2.5 w-2.5 text-red-500" />
                      <span className="text-[8.5px] font-semibold text-red-500 uppercase tracking-wider">Near Archive</span>
                    </div>
                  </div>
                )}
              </span>
              <span className={cn(
                "text-[10px] font-bold tabular-nums",
                progress >= 80 ? "text-red-500" : progress >= 50 ? "text-amber-500" : "text-muted-foreground"
              )}>
                {question.askCount}/{ARCHIVE_THRESHOLD}
              </span>
            </div>
            <Progress
              value={progress}
              className={cn(
                "h-1.5 rounded-full bg-muted/40",
                progress >= 80
                  ? "[&>div]:bg-gradient-to-r [&>div]:from-red-600 [&>div]:to-rose-400 [&>div]:shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                  : progress >= 50
                    ? "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-yellow-400 [&>div]:shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "[&>div]:bg-gradient-to-r [&>div]:from-violet-600 [&>div]:to-indigo-400 [&>div]:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              )}
            />
          </div>
        )}

        {/* Main content */}
        <div className="p-5 pt-4 space-y-3.5">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] gap-1 px-2 py-0.5 font-bold tracking-wide", typeColors[question.type])}>
              <TypeIcon className="h-3 w-3" />
              {question.type}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 font-bold tracking-wide", difficultyConfig[question.difficulty].color)}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background/80 shadow-sm border-border/50">
              {question.language}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-muted-foreground bg-background/80 shadow-sm border-border/50">
              {question.framework}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-muted-foreground ml-auto bg-background/80 shadow-sm border-border/50">
              {question.experience}
            </Badge>
          </div>

          {/* Question text */}
          <p className="text-[15px] font-semibold leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors duration-300 tracking-tight">
            {question.content}
          </p>

          {/* Code snippet preview */}
          {question.type === "Code" && question.codeSnippet && (
            <CodeDisplay
              code={question.codeSnippet}
              language={question.codeLanguage || "javascript"}
            />
          )}

          {/* Expanded content */}
          {expanded && (
            <div className="space-y-4 pt-4 mt-2 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* MCQ Options */}
              {question.type === "MCQ" && question.options && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <CircleDot className="h-3.5 w-3.5 text-violet-500" />
                    Options
                  </span>
                  <div className="grid gap-2">
                    {question.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm border transition-all duration-300 shadow-sm",
                          idx === question.correctOption
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] scale-[1.01]"
                            : "border-border/40 bg-muted/30 hover:bg-muted/50 hover:border-border/60"
                        )}
                      >
                        <span className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black border shadow-sm",
                          idx === question.correctOption
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30"
                            : "border-border/50 text-muted-foreground bg-background"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 font-medium">{opt}</span>
                        {idx === question.correctOption && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution / Explanation */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  {question.type === "MCQ" ? "Explanation" : "Reference Answer"}
                </span>
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-muted/40 to-muted/10 p-5 shadow-inner">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500" />
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {question.solution}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Tags</span>
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors shadow-sm cursor-default">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 font-semibold"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> Expand Details
                </>
              )}
            </Button>

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1.5 cursor-pointer hover:bg-accent/50 transition-all duration-200"
                onClick={handleCopy}
                id={`copy-${question.id}`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy
              </Button>

              {showRestore ? (
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-500/20 transition-all duration-200"
                  onClick={handleRestore}
                  id={`restore-${question.id}`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore
                </Button>
              ) : (
                <Button
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 cursor-pointer shadow-sm transition-all duration-200",
                    isNearArchive
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-red-500/20"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-violet-500/20"
                  )}
                  onClick={handleMarkAsked}
                  id={`mark-asked-${question.id}`}
                >
                  <Hand className="h-3.5 w-3.5" />
                  Mark as Asked
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
