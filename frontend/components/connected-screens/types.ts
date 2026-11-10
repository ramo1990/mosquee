
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "maintenance";

export type ScreenActionType =
  | "restart"
  | "maintenance"
  | "activate";

export type ConnectedScreen = {
  id: number;
  name: string;
  location?: string;
  group?: string;
  ip_address?: string;
  mac_address?: string;
  browser?: string;
  resolution?: string;
  connection_status: ConnectionStatus;
  last_seen?: string;
  is_active: boolean;
};

export type ScreenAction = {
  screenId: number;
  action: ScreenActionType;
};

export type ScreenStatusFilter =
  | "all"
  | ConnectionStatus;

export const STATUS_LABELS: Record<
  ConnectionStatus,
  string
> = {
  connected: "Connecté",
  disconnected: "Déconnecté",
  maintenance: "Maintenance",
};

export const STATUS_COLORS: Record<
  ConnectionStatus,
  string
> = {
  connected: "bg-emerald-100 text-emerald-800",
  disconnected: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-800",
};

export const STATUS_OPTIONS: ConnectionStatus[] = [
  "connected",
  "disconnected",
  "maintenance",
];