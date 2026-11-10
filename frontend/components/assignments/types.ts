
export type AssignmentType = "homework" | "quiz" | "exam" | "project";

export type Assignment = {
  id: number;
  title: string;
  assignment_type: AssignmentType;
  description?: string;
  classroom?: number | null;
  classroom_name?: string;
  teacher?: number | null;
  teacher_name?: string;
  due_date?: string;
  max_score?: number | null;
  is_published: boolean;
};

export type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

export type Classroom = {
  id: number;
  name: string;
};

export type AssignmentForm = {
  title: string;
  assignment_type: AssignmentType;
  description: string;
  classroom: string;
  teacher: string;
  due_date: string;
  max_score: string;
};

export type AssignmentFormField = keyof AssignmentForm;

export type AssignmentTypeFilter = "all" | AssignmentType;

export type AssignmentStatusFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: AssignmentForm = {
  title: "",
  assignment_type: "homework",
  description: "",
  classroom: "",
  teacher: "",
  due_date: "",
  max_score: "",
};

export const TYPE_LABELS: Record<AssignmentType, string> = {
  homework: "Devoir",
  quiz: "Quiz",
  exam: "Contrôle",
  project: "Projet",
};

export const TYPE_OPTIONS: AssignmentType[] = [
  "homework",
  "quiz",
  "exam",
  "project",
];