
export type ScreenStatus = "online" | "offline" | "maintenance";

export type Screen = {
  id: number;
  name: string;
  location?: string;
  group?: string;
  content?: string;
  status: ScreenStatus;
  last_seen?: string;
  is_active: boolean;
};

export type ScreenForm = {
  name: string;
  location: string;
  group: string;
  content: string;
  status: ScreenStatus;
};

export type ScreenFormField = keyof ScreenForm;

export const EMPTY_FORM: ScreenForm = {
  name: "",
  location: "",
  group: "",
  content: "",
  status: "online",
};

export const STATUS_LABELS: Record<ScreenStatus, string> = {
  online: "En ligne",
  offline: "Hors ligne",
  maintenance: "Maintenance",
};

export const STATUS_COLORS: Record<ScreenStatus, string> = {
  online: "bg-emerald-100 text-emerald-800",
  offline: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-800",
};

export const STATUS_OPTIONS: ScreenStatus[] = [
  "online",
  "offline",
  "maintenance",
];