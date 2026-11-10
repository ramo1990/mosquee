
export type ExpenseStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid";

export type Expense = {
  id: number;
  title: string;
  category?: string;
  amount: number;
  expense_date?: string;
  payment_method?: string;
  status: ExpenseStatus;
  notes?: string;
  is_active: boolean;
};

export type ExpenseForm = {
  title: string;
  category: string;
  amount: string;
  expense_date: string;
  payment_method: string;
  status: ExpenseStatus;
  notes: string;
};

export type ExpenseFormField = keyof ExpenseForm;

export const EMPTY_FORM: ExpenseForm = {
  title: "",
  category: "",
  amount: "",
  expense_date: "",
  payment_method: "",
  status: "pending",
  notes: "",
};

export const STATUS_LABELS: Record<ExpenseStatus, string> = {
  pending: "En attente",
  approved: "Validée",
  rejected: "Refusée",
  paid: "Payée",
};

export const STATUS_COLORS: Record<ExpenseStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-800",
};

export const STATUS_OPTIONS: ExpenseStatus[] = [
  "pending",
  "approved",
  "rejected",
  "paid",
];
