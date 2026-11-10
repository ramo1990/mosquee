
export type AnnouncementType =
  | "prayer"
  | "course"
  | "reminder"
  | "event"
  | "other";

export type AnnouncementPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type ReligiousAnnouncement = {
  id: number;
  title: string;
  announcement_type: AnnouncementType;
  content?: string;
  priority: AnnouncementPriority;
  start_date?: string;
  end_date?: string;
  is_published: boolean;
};

export type AnnouncementForm = {
  title: string;
  announcement_type: AnnouncementType;
  content: string;
  priority: AnnouncementPriority;
  start_date: string;
  end_date: string;
};

export type AnnouncementTypeFilter =
  | "all"
  | AnnouncementType;

export type AnnouncementPriorityFilter =
  | "all"
  | AnnouncementPriority;

export type AnnouncementStatusFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: AnnouncementForm = {
  title: "",
  announcement_type: "reminder",
  content: "",
  priority: "normal",
  start_date: "",
  end_date: "",
};

export const TYPE_LABELS: Record<AnnouncementType, string> = {
  prayer: "Prière",
  course: "Cours",
  reminder: "Rappel",
  event: "Événement",
  other: "Autre",
};

export const TYPE_OPTIONS: AnnouncementType[] = [
  "prayer",
  "course",
  "reminder",
  "event",
  "other",
];

export const PRIORITY_LABELS: Record<
  AnnouncementPriority,
  string
> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

export const PRIORITY_COLORS: Record<
  AnnouncementPriority,
  string
> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-700",
};

export const PRIORITY_OPTIONS: AnnouncementPriority[] = [
  "low",
  "normal",
  "high",
  "urgent",
];