
export type ActivityType =
  | "meeting"
  | "training"
  | "community_event"
  | "charity"
  | "other";

export type ActivityStatus =
  | "planned"
  | "ongoing"
  | "completed"
  | "cancelled";

export type Activity = {
  id: number;
  title: string;
  activity_type: ActivityType;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  organizer?: string;
  max_participants?: number | null;
  participant_count?: number;
  status: ActivityStatus;
  is_published: boolean;
};

export type ActivityForm = {
  title: string;
  activity_type: ActivityType;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  max_participants: string;
  status: ActivityStatus;
};

export type ActivityTypeFilter = "all" | ActivityType;
export type ActivityStatusFilter = "all" | ActivityStatus;
export type ActivityPublicationFilter =
  | "all"
  | "published"
  | "draft";

export const EMPTY_FORM: ActivityForm = {
  title: "",
  activity_type: "community_event",
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

export const TYPE_LABELS: Record<ActivityType, string> = {
  meeting: "Réunion",
  training: "Formation",
  community_event: "Événement communautaire",
  charity: "Action caritative",
  other: "Autre",
};

export const TYPE_OPTIONS: ActivityType[] = [
  "meeting",
  "training",
  "community_event",
  "charity",
  "other",
];

export const STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: "Planifiée",
  ongoing: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

export const STATUS_COLORS: Record<ActivityStatus, string> = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: ActivityStatus[] = [
  "planned",
  "ongoing",
  "completed",
  "cancelled",
];