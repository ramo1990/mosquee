
export type TransactionType = "income" | "expense";

export type FinancialTransaction = {
  id: number;
  title: string;
  transaction_type: TransactionType;
  amount: number;
  date: string;
  category?: string;
  payment_method?: string;
  notes?: string;
};

export type FinanceSummaryData = {
  total_income: number;
  total_expenses: number;
  balance: number;
};

export type FinanceFilters = {
  start_date: string;
  end_date: string;
  transaction_type: "all" | TransactionType;
  category: string;
};

export const EMPTY_FILTERS: FinanceFilters = {
  start_date: "",
  end_date: "",
  transaction_type: "all",
  category: "",
};

export const EMPTY_SUMMARY: FinanceSummaryData = {
  total_income: 0,
  total_expenses: 0,
  balance: 0,
};