export type ContributionStatus =
  | "pending"
  | "paid"
  | "partial"
  | "cancelled";

export type Contribution = {
  id: number;
  member?: number | null;
  member_name?: string;
  amount: number;
  amount_paid?: number;
  due_date?: string;
  paid_date?: string;
  status: ContributionStatus;
  notes?: string;
  is_active: boolean;
};

export type Member = {
  id: number;
  first_name: string;
  last_name: string;
};

export type ContributionForm = {
  member: string;
  amount: string;
  amount_paid: string;
  due_date: string;
  paid_date: string;
  status: ContributionStatus;
  notes: string;
};

export type ContributionStatusFilter =
  | "all"
  | ContributionStatus;

export const EMPTY_FORM: ContributionForm = {
  member: "",
  amount: "",
  amount_paid: "",
  due_date: "",
  paid_date: "",
  status: "pending",
  notes: "",
};

export const STATUS_LABELS: Record<
  ContributionStatus,
  string
> = {
  pending: "En attente",
  paid: "Payée",
  partial: "Partielle",
  cancelled: "Annulée",
};

export const STATUS_COLORS: Record<
  ContributionStatus,
  string
> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: ContributionStatus[] = [
  "pending",
  "paid",
  "partial",
  "cancelled",
];

export type ContributionFormField = keyof ContributionForm;