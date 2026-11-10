export type Course = {
  id: number;
  title: string;
  subject?: string;
  description?: string;
  teacher?: number | null;
  teacher_name?: string;
  classroom?: number | null;
  classroom_name?: string;
  schedule?: string;
  is_active: boolean;
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

export type CourseForm = {
  title: string;
  subject: string;
  description: string;
  teacher: string;
  classroom: string;
  schedule: string;
};

export const EMPTY_FORM: CourseForm = {
  title: "",
  subject: "",
  description: "",
  teacher: "",
  classroom: "",
  schedule: "",
};