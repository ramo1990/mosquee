
export type RamadanDay = {
  id: number;
  day_number: number;
  date: string;
  suhoor_end_time?: string;
  iftar_time?: string;
  tarawih_time?: string;
  activity?: string;
  notes?: string;
  is_published: boolean;
};

export type RamadanDayForm = {
  day_number: string;
  date: string;
  suhoor_end_time: string;
  iftar_time: string;
  tarawih_time: string;
  activity: string;
  notes: string;
};

export type RamadanFormField = keyof RamadanDayForm;

export type RamadanPublicationFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: RamadanDayForm = {
  day_number: "",
  date: "",
  suhoor_end_time: "",
  iftar_time: "",
  tarawih_time: "",
  activity: "",
  notes: "",
};