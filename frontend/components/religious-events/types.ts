
export type ReligiousEventType =
  | "eid"
  | "ramadan"
  | "mawlid"
  | "ashura"
  | "conference"
  | "other";

export type EventStatus =
  | "planned"
  | "ongoing"
  | "completed"
  | "cancelled";

export type ReligiousEvent = {
  id: number;
  title: string;
  event_type: ReligiousEventType;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  organizer?: string;
  max_participants?: number | null;
  participant_count?: number;
  status: EventStatus;
  is_published: boolean;
};

export type ReligiousEventForm = {
  title: string;
  event_type: ReligiousEventType;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  max_participants: string;
  status: EventStatus;
};

export type ReligiousEventFormField = keyof ReligiousEventForm;

export type EventTypeFilter = "all" | ReligiousEventType;
export type EventStatusFilter = "all" | EventStatus;
export type PublicationFilter = "all" | "published" | "draft";

export const EMPTY_FORM: ReligiousEventForm = {
  title: "",
  event_type: "conference",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  organizer: "",
  max_participants: "",
  status: "planned",
};

export const TYPE_LABELS: Record<ReligiousEventType, string> = {
  eid: "Aïd",
  ramadan: "Ramadan",
  mawlid: "Mawlid",
  ashura: "Achoura",
  conference: "Conférence",
  other: "Autre",
};

export const TYPE_OPTIONS: ReligiousEventType[] = [
  "eid",
  "ramadan",
  "mawlid",
  "ashura",
  "conference",
  "other",
];

export const STATUS_LABELS: Record<EventStatus, string> = {
  planned: "Planifié",
  ongoing: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export const STATUS_COLORS: Record<EventStatus, string> = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: EventStatus[] = [
  "planned",
  "ongoing",
  "completed",
  "cancelled",
];