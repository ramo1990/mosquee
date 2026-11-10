export type Student = {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  classroom?: number | null;
  classroom_name?: string;
  is_active: boolean;
};

export type Classroom = {
  id: number;
  name: string;
};

export type StudentForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  classroom: string;
};

export const EMPTY_FORM: StudentForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birth_date: "",
  classroom: "",
};