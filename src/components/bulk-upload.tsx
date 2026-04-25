"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { useStore } from "@/lib/store";
import { QuestionType, Difficulty, ExperienceLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const TEMPLATE_HEADERS = [
  "type",
  "content",
  "language",
  "framework",
  "difficulty",
  "experience",
  "solution",
  "options",
  "correctOption",
  "codeSnippet",
  "codeLanguage",
  "tags",
];

interface ParsedRow {
  type: QuestionType;
  content: string;
  language: string;
  framework: string;
  difficulty: Difficulty;
  experience: ExperienceLevel;
  solution: string;
  options?: string[];
  correctOption?: number;
  codeSnippet?: string;
  codeLanguage?: string;
  tags?: string[];
  valid: boolean;
  errors: string[];
}

export function BulkUpload() {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkImport = useStore((s) => s.bulkImport);

  const downloadTemplate = () => {
    const csvContent = [
      TEMPLATE_HEADERS.join(","),
      'MCQ,"What is the default value of int in Java?",Java,Spring Boot,Easy,0-2 years,"The default value is 0","0|null|undefined|NaN",0,,,OOP;basics',
      'Theory,"Explain REST API principles",JavaScript,Node.js,Medium,3-5 years,"REST uses HTTP methods...",,,,API;REST',
      'Code,"Write a function to reverse a string",Python,Django,Easy,0-2 years,"Uses slicing","","","def reverse(s): return s[::-1]",python,strings;algorithms',
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview_questions_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: ParsedRow[] = results.data.map((row: Record<string, string>) => {
          const errors: string[] = [];
          const type = (row.type || "").trim() as QuestionType;
          const content = (row.content || "").trim();
          const language = (row.language || "").trim();
          const framework = (row.framework || "").trim();
          const difficulty = (row.difficulty || "Easy").trim() as Difficulty;
          const experience = (row.experience || "0-2 years").trim() as ExperienceLevel;
          const solution = (row.solution || "").trim();

          if (!["MCQ", "Theory", "Code"].includes(type)) errors.push("Invalid type");
          if (!content) errors.push("Missing content");
          if (!language) errors.push("Missing language");
          if (!solution) errors.push("Missing solution");

          const options = row.options ? row.options.split("|").map((o: string) => o.trim()) : undefined;
          const correctOption = row.correctOption ? parseInt(row.correctOption) : undefined;
          const codeSnippet = (row.codeSnippet || "").trim() || undefined;
          const codeLanguage = (row.codeLanguage || "").trim() || undefined;
          const tags = row.tags ? row.tags.split(";").map((t: string) => t.trim()).filter(Boolean) : undefined;

          return {
            type,
            content,
            language,
            framework,
            difficulty,
            experience,
            solution,
            options,
            correctOption,
            codeSnippet,
            codeLanguage,
            tags,
            valid: errors.length === 0,
            errors,
          };
        });
        setParsedRows(rows);
      },
    });
  };

  const handleImport = () => {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) {
      toast.error("No valid rows to import");
      return;
    }

    const count = bulkImport(
      validRows.map(({ valid, errors, ...rest }) => rest)
    );
    toast.success(`Upload Successful`, {
      description: `${count} questions imported successfully!`,
    });
    setParsedRows([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validCount = parsedRows.filter((r) => r.valid).length;
  const errorCount = parsedRows.filter((r) => !r.valid).length;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-violet-500" />
          Bulk Upload Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-2 cursor-pointer"
            onClick={downloadTemplate}
            id="download-template"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV Template
          </Button>

          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              {fileName || "Upload CSV File"}
            </Button>
          </div>
        </div>

        {/* Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3" /> {validCount} valid
              </Badge>
              {errorCount > 0 && (
                <Badge variant="outline" className="text-xs gap-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" /> {errorCount} errors
                </Badge>
              )}
            </div>

            <div className="rounded-lg border border-border overflow-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-12">#</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Content</TableHead>
                    <TableHead className="text-xs">Language</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row, idx) => (
                    <TableRow key={idx} className={!row.valid ? "bg-red-500/5" : ""}>
                      <TableCell className="text-xs font-mono">{idx + 1}</TableCell>
                      <TableCell className="text-xs">{row.type}</TableCell>
                      <TableCell className="text-xs max-w-48 truncate">{row.content}</TableCell>
                      <TableCell className="text-xs">{row.language}</TableCell>
                      <TableCell className="text-xs">
                        {row.valid ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-red-600 dark:text-red-400">
                            {row.errors.join(", ")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              onClick={handleImport}
              disabled={validCount === 0}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
              id="import-questions"
            >
              Import {validCount} Question{validCount !== 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
