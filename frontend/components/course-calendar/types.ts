
export type CalendarEventType = "course" | "exam" | "activity" | "meeting";

export type CalendarEvent = {
  id: number;
  title: string;
  event_type: CalendarEventType;
  description?: string;
  classroom?: number | null;
  classroom_name?: string;
  teacher?: number | null;
  teacher_name?: string;
  start_datetime: string;
  end_datetime: string;
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

export type CalendarEventForm = {
  title: string;
  event_type: CalendarEventType;
  description: string;
  classroom: string;
  teacher: string;
  start_datetime: string;
  end_datetime: string;
};

export type CalendarEventFormField = keyof CalendarEventForm;

export const EMPTY_FORM: CalendarEventForm = {
  title: "",
  event_type: "course",
  description: "",
  classroom: "",
  teacher: "",
  start_datetime: "",
  end_datetime: "",
};

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  course: "Cours",
  exam: "Évaluation",
  activity: "Activité",
  meeting: "Réunion",
};

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  course: "bg-emerald-100 text-emerald-800 border-emerald-200",
  exam: "bg-red-100 text-red-700 border-red-200",
  activity: "bg-blue-100 text-blue-800 border-blue-200",
  meeting: "bg-amber-100 text-amber-800 border-amber-200",
};

export const EVENT_TYPE_OPTIONS: CalendarEventType[] = [
  "course",
  "exam",
  "activity",
  "meeting",
];

export const WEEK_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function getWeekStart(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}
