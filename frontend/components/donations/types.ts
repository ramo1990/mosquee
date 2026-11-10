export type DonationStatus =
  | "pending"
  | "received"
  | "cancelled";

export type Donation = {
  id: number;
  donor_name: string;
  donor?: number | null;
  amount: number;
  project?: string;
  payment_method?: string;
  donation_date?: string;
  status: DonationStatus;
  notes?: string;
  is_active: boolean;
};

export type DonationForm = {
  donor_name: string;
  donor: string;
  amount: string;
  project: string;
  payment_method: string;
  donation_date: string;
  status: DonationStatus;
  notes: string;
};

export type DonationFormField = keyof DonationForm;

export type DonationStatusFilter =
  | "all"
  | DonationStatus;

export const EMPTY_FORM: DonationForm = {
  donor_name: "",
  donor: "",
  amount: "",
  project: "",
  payment_method: "",
  donation_date: "",
  status: "received",
  notes: "",
};

export const STATUS_LABELS: Record<
  DonationStatus,
  string
> = {
  pending: "En attente",
  received: "Reçu",
  cancelled: "Annulé",
};

export const STATUS_COLORS: Record<
  DonationStatus,
  string
> = {
  pending: "bg-amber-100 text-amber-800",
  received: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: DonationStatus[] = [
  "pending",
  "received",
  "cancelled",
];