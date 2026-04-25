export type QuestionType = "MCQ" | "Theory" | "Code";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type ExperienceLevel = "0-2 years" | "3-5 years" | "5+ years";
export type QuestionStatus = "Active" | "Archived";

export interface Question {
  id: string;
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
  askCount: number;
  status: QuestionStatus;
  createdAt: string;
  tags?: string[];
}

export interface Filters {
  language: string[];
  framework: string[];
  experience: string[];
  difficulty: string[];
  type: string[];
}

export const LANGUAGES = ["C#", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "SQL"];
export const FRAMEWORKS = [".NET", "React", "Angular", "Node.js", "Spring Boot", "Django", "Next.js", "Express"];
export const EXPERIENCE_LEVELS: ExperienceLevel[] = ["0-2 years", "3-5 years", "5+ years"];
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const QUESTION_TYPES: QuestionType[] = ["MCQ", "Theory", "Code"];
export const ARCHIVE_THRESHOLD = 15;

export const CODE_LANGUAGES: Record<string, string> = {
  "C#": "csharp",
  Java: "java",
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Go: "go",
  Rust: "rust",
  SQL: "sql",
};
