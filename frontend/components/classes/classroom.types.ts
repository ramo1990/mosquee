
export type Classroom = {
  id: number;
  name: string;
  level?: string;
  description?: string;
  student_count?: number;
  is_active: boolean;
};

export type ClassroomForm = {
  name: string;
  level: string;
  description: string;
};

export type ClassroomStatusFilter = "all" | "active" | "inactive";

export const EMPTY_FORM: ClassroomForm = {
  name: "",
  level: "",
  description: "",
};
