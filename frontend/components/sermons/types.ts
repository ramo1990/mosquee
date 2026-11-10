
export type SermonType =
  | "khutbah"
  | "sermon"
  | "lesson"
  | "conference";

export type Sermon = {
  id: number;
  title: string;
  sermon_type: SermonType;
  content?: string;
  imam?: number | null;
  imam_name?: string;
  date?: string;
  video_url?: string;
  audio_url?: string;
  is_published: boolean;
};

export type Imam = {
  id: number;
  first_name: string;
  last_name: string;
};

export type SermonForm = {
  title: string;
  sermon_type: SermonType;
  content: string;
  imam: string;
  date: string;
  video_url: string;
  audio_url: string;
};

export type SermonFormField = keyof SermonForm;

export type SermonStatusFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: SermonForm = {
  title: "",
  sermon_type: "khutbah",
  content: "",
  imam: "",
  date: "",
  video_url: "",
  audio_url: "",
};

export const TYPE_LABELS: Record<SermonType, string> = {
  khutbah: "Khutba",
  sermon: "Sermon",
  lesson: "Enseignement",
  conference: "Conférence",
};

export const TYPE_OPTIONS: SermonType[] = [
  "khutbah",
  "sermon",
  "lesson",
  "conference",
];