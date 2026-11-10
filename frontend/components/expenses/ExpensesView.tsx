
"use client";

import { Expense, ExpenseStatus } from "./types";
import ExpensesTable from "./ExpensesTable";

type Props = {
  expenses: Expense[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (expense: Expense) => void;
  onUpdateStatus: (
    expense: Expense,
    status: ExpenseStatus
  ) => void;
};

export default function ExpensesView({
  expenses,
  loading,
  updatingId,
  onEdit,
  onUpdateStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des dépenses
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {expenses.length} dépense(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : expenses.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune dépense trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Enregistrez une nouvelle dépense ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <ExpensesTable
          expenses={expenses}
          updatingId={updatingId}
          onEdit={onEdit}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
}