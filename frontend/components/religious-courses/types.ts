
export type CourseSubject =
  | "quran"
  | "hadith"
  | "fiqh"
  | "aqidah"
  | "arabic"
  | "other";

export type ReligiousCourse = {
  id: number;
  title: string;
  subject: CourseSubject;
  description?: string;
  teacher?: number | null;
  teacher_name?: string;
  classroom?: number | null;
  classroom_name?: string;
  schedule?: string;
  is_active: boolean;
};

export type ReligiousCourseForm = {
  title: string;
  subject: CourseSubject;
  description: string;
  teacher: string;
  classroom: string;
  schedule: string;
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

export const EMPTY_FORM: ReligiousCourseForm = {
  title: "",
  subject: "quran",
  description: "",
  teacher: "",
  classroom: "",
  schedule: "",
};

export const SUBJECT_LABELS: Record<CourseSubject, string> = {
  quran: "Coran",
  hadith: "Hadith",
  fiqh: "Fiqh",
  aqidah: "Aqidah",
  arabic: "Arabe",
  other: "Autre",
};

export const SUBJECT_OPTIONS: CourseSubject[] = [
  "quran",
  "hadith",
  "fiqh",
  "aqidah",
  "arabic",
  "other",
];

export type SubjectFilter = "all" | CourseSubject;
export type StatusFilter = "all" | "active" | "inactive";
