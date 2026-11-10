
"use client";

type Props = {
  income: number;
  expenses: number;
};

export default function FinanceSummary({
  income,
  expenses,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-medium text-gray-500">
          Recettes filtrées
        </p>

        <p className="mt-3 text-2xl font-extrabold text-emerald-700">
          {income} €
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-medium text-gray-500">
          Dépenses filtrées
        </p>

        <p className="mt-3 text-2xl font-extrabold text-red-600">
          {expenses} €
        </p>
      </div>
    </div>
  );
}