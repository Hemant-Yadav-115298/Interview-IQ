"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Question, QuestionType, Difficulty, ExperienceLevel, LANGUAGES, FRAMEWORKS, EXPERIENCE_LEVELS, DIFFICULTIES, QUESTION_TYPES } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  CircleDot,
  FileText,
  Code2,
  Sparkles,
  Tag,
  BookOpen,
  Languages,
  Boxes,
  Gauge,
  BriefcaseBusiness,
  ListChecks,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  editQuestion?: Question | null;
}

const emptyForm = {
  type: "MCQ" as QuestionType,
  content: "",
  language: "",
  framework: "",
  difficulty: "Easy" as Difficulty,
  experience: "0-2 years" as ExperienceLevel,
  solution: "",
  options: ["", "", "", ""],
  correctOption: 0,
  codeSnippet: "",
  codeLanguage: "javascript",
  tags: "",
};

const typeConfig = {
  MCQ: { icon: CircleDot, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  Theory: { icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  Code: { icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
};

export function QuestionModal({ open, onClose, editQuestion }: QuestionModalProps) {
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editQuestion) {
      setForm({
        type: editQuestion.type,
        content: editQuestion.content,
        language: editQuestion.language,
        framework: editQuestion.framework,
        difficulty: editQuestion.difficulty,
        experience: editQuestion.experience,
        solution: editQuestion.solution,
        options: editQuestion.options || ["", "", "", ""],
        correctOption: editQuestion.correctOption || 0,
        codeSnippet: editQuestion.codeSnippet || "",
        codeLanguage: editQuestion.codeLanguage || "javascript",
        tags: editQuestion.tags?.join(", ") || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editQuestion, open]);

  const handleSubmit = () => {
    if (!form.content.trim()) {
      toast.error("Question content is required");
      return;
    }
    if (!form.language) {
      toast.error("Programming language is required");
      return;
    }
    if (!form.framework) {
      toast.error("Framework is required");
      return;
    }
    if (!form.solution.trim()) {
      toast.error("Solution/explanation is required");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const questionData = {
      type: form.type,
      content: form.content,
      language: form.language,
      framework: form.framework,
      difficulty: form.difficulty,
      experience: form.experience,
      solution: form.solution,
      tags,
      ...(form.type === "MCQ" && {
        options: form.options.filter((o) => o.trim()),
        correctOption: form.correctOption,
      }),
      ...(form.type === "Code" && {
        codeSnippet: form.codeSnippet,
        codeLanguage: form.codeLanguage,
      }),
    };

    if (editQuestion) {
      updateQuestion(editQuestion.id, questionData);
      toast.success("Question updated successfully!");
    } else {
      addQuestion(questionData);
      toast.success("Question added successfully!");
    }
    onClose();
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, ""] });
  };

  const removeOption = (idx: number) => {
    if (form.options.length <= 2) return;
    const newOptions = form.options.filter((_, i) => i !== idx);
    setForm({
      ...form,
      options: newOptions,
      correctOption: form.correctOption >= newOptions.length ? 0 : form.correctOption,
    });
  };

  const currentConfig = typeConfig[form.type];
  const TypeIcon = currentConfig.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 gap-0 overflow-hidden border-border/40 shadow-2xl">
        {/* Header with gradient */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              {editQuestion ? "Edit Question" : "Create New Question"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Fill in the details below. Required fields are marked with *.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] px-6 py-5 space-y-5">
          {/* Question Type Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Question Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {QUESTION_TYPES.map((t) => {
                const config = typeConfig[t];
                const Icon = config.icon;
                const isSelected = form.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                      isSelected
                        ? `${config.border} ${config.bg} ${config.color} shadow-sm`
                        : "border-border/40 hover:border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isSelected ? config.color : "")} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Question Content */}
          <div className="space-y-2">
            <Label htmlFor="q-content" className="text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              Question *
            </Label>
            <Textarea
              id="q-content"
              placeholder="Enter the question text..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5 text-muted-foreground" />
                Language *
              </Label>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger className="text-xs cursor-pointer h-9">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-muted-foreground" />
                Framework *
              </Label>
              <Select value={form.framework} onValueChange={(v) => setForm({ ...form, framework: v })}>
                <SelectTrigger className="text-xs cursor-pointer h-9">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  {FRAMEWORKS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                Difficulty
              </Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as Difficulty })}>
                <SelectTrigger className="text-xs cursor-pointer h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-muted-foreground" />
                Experience Level
              </Label>
              <Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v as ExperienceLevel })}>
                <SelectTrigger className="text-xs cursor-pointer h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* MCQ Options */}
          {form.type === "MCQ" && (
            <>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                  Answer Options
                  <span className="text-[10px] text-muted-foreground font-normal ml-1">(select correct answer)</span>
                </Label>
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, correctOption: idx })}
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 cursor-pointer",
                        form.correctOption === idx
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                          : "border-border text-muted-foreground hover:border-emerald-500/50"
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...form.options];
                        newOpts[idx] = e.target.value;
                        setForm({ ...form, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="text-xs h-9"
                    />
                    {form.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-destructive/60 hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeOption(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="text-xs cursor-pointer gap-1.5 h-8" onClick={addOption}>
                  <Plus className="h-3.5 w-3.5" /> Add Option
                </Button>
              </div>
            </>
          )}

          {/* Code Snippet */}
          {form.type === "Code" && (
            <>
              <Separator className="opacity-50" />
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Code Language
                  </Label>
                  <Select value={form.codeLanguage} onValueChange={(v) => setForm({ ...form, codeLanguage: v })}>
                    <SelectTrigger className="text-xs cursor-pointer h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["javascript", "typescript", "python", "java", "csharp", "go", "rust", "sql"].map(
                        (l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Code Snippet</Label>
                  <Textarea
                    value={form.codeSnippet}
                    onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
                    placeholder="Paste your code snippet here..."
                    rows={5}
                    className="font-mono text-xs resize-none"
                  />
                </div>
              </div>
            </>
          )}

          <Separator className="opacity-50" />

          {/* Solution */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              {form.type === "MCQ" ? "Explanation *" : "Reference Answer *"}
            </Label>
            <Textarea
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              placeholder={form.type === "MCQ" ? "Explain why the correct answer is right..." : "Provide a detailed reference answer..."}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Tags
              <span className="text-[10px] text-muted-foreground font-normal">(comma-separated)</span>
            </Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g., algorithms, sorting, data-structures"
              className="text-xs h-9"
            />
            {form.tags && (
              <div className="flex gap-1 flex-wrap">
                {form.tags.split(",").map((t, i) => t.trim() && (
                  <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">
                    #{t.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with gradient border */}
        <div className="border-t border-border/40 bg-gradient-to-r from-violet-500/[0.02] to-indigo-500/[0.02] px-6 py-4">
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={onClose} className="cursor-pointer h-9">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 cursor-pointer h-9 shadow-md shadow-violet-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {editQuestion ? "Save Changes" : "Create Question"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
