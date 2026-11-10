
export type AnnouncementType =
  | "general"
  | "prayer"
  | "event"
  | "course"
  | "urgent";

export type AnnouncementPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type Announcement = {
  id: number;
  title: string;
  announcement_type: AnnouncementType;
  content?: string;
  priority: AnnouncementPriority;
  start_date?: string;
  end_date?: string;
  display_on_screens: boolean;
  is_published: boolean;
};

export type AnnouncementForm = {
  title: string;
  announcement_type: AnnouncementType;
  content: string;
  priority: AnnouncementPriority;
  start_date: string;
  end_date: string;
  display_on_screens: boolean;
};

export type AnnouncementTypeFilter = "all" | AnnouncementType;
export type AnnouncementPriorityFilter = "all" | AnnouncementPriority;
export type AnnouncementStatusFilter = "all" | "published" | "draft";

export const EMPTY_FORM: AnnouncementForm = {
  title: "",
  announcement_type: "general",
  content: "",
  priority: "normal",
  start_date: "",
  end_date: "",
  display_on_screens: true,
};

export const TYPE_LABELS: Record<AnnouncementType, string> = {
  general: "Générale",
  prayer: "Prière",
  event: "Événement",
  course: "Cours",
  urgent: "Urgente",
};

export const TYPE_OPTIONS: AnnouncementType[] = [
  "general",
  "prayer",
  "event",
  "course",
  "urgent",
];

export const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

export const PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
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