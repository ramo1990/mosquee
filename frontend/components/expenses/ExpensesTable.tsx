
"use client";

import {
  Expense,
  ExpenseStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from "./types";

type Props = {
  expenses: Expense[];
  updatingId: number | null;

  onEdit: (expense: Expense) => void;
  onUpdateStatus: (
    expense: Expense,
    status: ExpenseStatus
  ) => void;
};

export default function ExpensesTable({
  expenses,
  updatingId,
  onEdit,
  onUpdateStatus,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4">Dépense</th>
            <th className="px-6 py-4">Catégorie</th>
            <th className="px-6 py-4">Montant</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Paiement</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {expenses.map((expense) => {
            const isUpdating = updatingId === expense.id;

            return (
              <tr
                key={expense.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {expense.title}
                  </div>

                  {expense.notes && (
                    <div className="mt-1 max-w-md text-xs text-gray-500">
                      {expense.notes}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {expense.category || "—"}
                </td>

                <td className="px-6 py-4 font-bold text-gray-900">
                  {expense.amount} €
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {expense.expense_date || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {expense.payment_method || "—"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[expense.status]}`}
                  >
                    {STATUS_LABELS[expense.status]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => onEdit(expense)}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Modifier
                    </button>

                    {expense.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(expense, "approved")
                          }
                          disabled={isUpdating}
                          className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                        >
                          Valider
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(expense, "rejected")
                          }
                          disabled={isUpdating}
                          className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                        >
                          Refuser
                        </button>
                      </>
                    )}

                    {expense.status === "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateStatus(expense, "paid")
                        }
                        disabled={isUpdating}
                        className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                      >
                        {isUpdating
                          ? "Traitement..."
                          : "Marquer payée"}
                      </button>
                    )}

                    {isUpdating && (
                      <span className="text-xs text-gray-400">
                        Traitement...
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}