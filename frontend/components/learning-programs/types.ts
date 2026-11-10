export type LearningProgram = {
  id: number;
  title: string;
  level?: string;
  description?: string;
  objectives?: string;
  content?: string;
  duration_weeks?: number | null;
  is_active: boolean;
};

export type ProgramForm = {
  title: string;
  level: string;
  description: string;
  objectives: string;
  content: string;
  duration_weeks: string;
};

export const EMPTY_FORM: ProgramForm = {
  title: "",
  level: "",
  description: "",
  objectives: "",
  content: "",
  duration_weeks: "",
};