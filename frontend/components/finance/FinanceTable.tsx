
"use client";

import { FinancialTransaction } from "./types";

type Props = {
  transactions: FinancialTransaction[];
  loading: boolean;
};

export default function FinanceTable({
  transactions,
  loading,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Historique des transactions
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {transactions.length} transaction(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune transaction trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Modifiez les filtres ou enregistrez des transactions.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Paiement</th>
                <th className="px-6 py-4 text-right">Montant</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-600">
                    {transaction.date}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {transaction.title}
                    </div>

                    {transaction.notes && (
                      <div className="mt-1 max-w-md text-xs text-gray-500">
                        {transaction.notes}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {transaction.category || "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {transaction.payment_method || "—"}
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-bold ${
                      transaction.transaction_type === "income"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "income"
                      ? "+"
                      : "-"}
                    {transaction.amount} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}