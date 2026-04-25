"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Question } from "@/lib/types";
import { AppShell } from "@/components/app-shell";
import { QuestionModal } from "@/components/question-modal";
import { BulkUpload } from "@/components/bulk-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ShieldCheck,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const difficultyColors = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function AdminPage() {
  const adminAuthenticated = useStore((s) => s.adminAuthenticated);
  const authenticateAdmin = useStore((s) => s.authenticateAdmin);
  const logoutAdmin = useStore((s) => s.logoutAdmin);
  const questions = useStore((s) => s.questions);
  const deleteQuestion = useStore((s) => s.deleteQuestion);

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<"createdAt" | "askCount" | "difficulty">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleLogin = () => {
    if (authenticateAdmin(pin)) {
      setPinError(false);
      toast.success("Admin access granted");
    } else {
      setPinError(true);
      toast.error("Invalid PIN");
    }
    setPin("");
  };

  const handleDelete = (id: string) => {
    deleteQuestion(id);
    setDeleteConfirm(null);
    toast.success("Question deleted");
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  // Sort questions
  const sorted = [...questions].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "createdAt") {
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    }
    if (sortField === "askCount") {
      return (a.askCount - b.askCount) * dir;
    }
    const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
    return (diffOrder[a.difficulty] - diffOrder[b.difficulty]) * dir;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // PIN Gate
  if (!adminAuthenticated) {
    return (
      <AppShell title="Admin Portal">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-sm border-border/60">
            <CardHeader className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto mb-3 shadow-lg">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-lg">Admin Access</CardTitle>
              <p className="text-xs text-muted-foreground">
                Enter the admin PIN to access the management portal.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pin" className="text-xs font-semibold">
                  PIN Code
                </Label>
                <Input
                  id="admin-pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={cn("text-center text-lg tracking-[0.5em]", pinError && "border-destructive")}
                  maxLength={8}
                />
                {pinError && (
                  <p className="text-xs text-destructive">Invalid PIN. Please try again.</p>
                )}
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
                id="admin-login-btn"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Authenticate
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                Default PIN: 1234
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Admin Portal">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Question Management</h2>
              <p className="text-xs text-muted-foreground">
                Add, edit, or remove questions from the database.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditQuestion(null);
                setModalOpen(true);
              }}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
              id="add-question-btn"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Question
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logoutAdmin}
              className="cursor-pointer text-xs gap-1.5"
              id="admin-logout-btn"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Bulk Upload */}
        <BulkUpload />

        {/* Questions Table */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">
              All Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-12">#</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs min-w-[200px]">Content</TableHead>
                    <TableHead className="text-xs">Language</TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("difficulty")}
                    >
                      Difficulty {sortField === "difficulty" && (sortDir === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("askCount")}
                    >
                      Asks {sortField === "askCount" && (sortDir === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((q, idx) => (
                    <TableRow key={q.id} className="group">
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {page * ITEMS_PER_PAGE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {q.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate">
                        {q.content}
                      </TableCell>
                      <TableCell className="text-xs">{q.language}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px]", difficultyColors[q.difficulty])}
                        >
                          {q.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {q.askCount}/15
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            q.status === "Active"
                              ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "text-amber-600 dark:text-amber-400 border-amber-500/20"
                          )}
                        >
                          {q.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditQuestion(q);
                                setModalOpen(true);
                              }}
                              className="cursor-pointer text-xs"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(q.id)}
                              className="cursor-pointer text-xs text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Question Modal */}
      <QuestionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditQuestion(null);
        }}
        editQuestion={editQuestion}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The question will be permanently removed from the database.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
