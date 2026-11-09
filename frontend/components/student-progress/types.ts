export type Student = {
  id: number;
  first_name: string;
  last_name: string;
  classroom?: number | null;
  classroom_name?: string;
};

export type Classroom = {
  id: number;
  name: string;
};

export type StudentProgress = {
  id: number;
  student: number;
  student_name?: string;
  classroom?: number | null;
  classroom_name?: string;
  average_score?: number | null;
  appreciation?: string;
  strengths?: string;
  difficulties?: string;
  comments?: string;
  is_active?: boolean;
};

export type ProgressForm = {
  student: string;
  average_score: string;
  appreciation: string;
  strengths: string;
  difficulties: string;
  comments: string;
};

export type ProgressFormField = keyof ProgressForm;

export const EMPTY_FORM: ProgressForm = {
  student: "",
  average_score: "",
  appreciation: "",
  strengths: "",
  difficulties: "",
  comments: "",
};