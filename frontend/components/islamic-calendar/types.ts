
export type IslamicEventType =
  | "ramadan"
  | "eid"
  | "ashura"
  | "mawlid"
  | "isra_miraj"
  | "other";

export type IslamicCalendarEvent = {
  id: number;
  title: string;
  event_type: IslamicEventType;
  description?: string;
  hijri_date?: string;
  gregorian_date?: string;
  is_active: boolean;
};

export type IslamicEventForm = {
  title: string;
  event_type: IslamicEventType;
  description: string;
  hijri_date: string;
  gregorian_date: string;
};

export type IslamicEventFormField =
  keyof IslamicEventForm;

export type IslamicEventTypeFilter =
  | "all"
  | IslamicEventType;

export type StatusFilter =
  | "all"
  | "active"
  | "inactive";

export const EMPTY_FORM: IslamicEventForm = {
  title: "",
  event_type: "other",
  description: "",
  hijri_date: "",
  gregorian_date: "",
};

export const EVENT_TYPE_LABELS: Record<
  IslamicEventType,
  string
> = {
  ramadan: "Ramadan",
  eid: "Aïd",
  ashura: "Achoura",
  mawlid: "Mawlid",
  isra_miraj: "Isra et Miraj",
  other: "Autre",
};

export const EVENT_TYPE_OPTIONS: IslamicEventType[] = [
  "ramadan",
  "eid",
  "ashura",
  "mawlid",
  "isra_miraj",
  "other",
];