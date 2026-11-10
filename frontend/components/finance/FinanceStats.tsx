
"use client";

type Props = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  filteredBalance: number;
};

export default function FinanceStats({
  totalIncome,
  totalExpenses,
  balance,
  filteredBalance,
}: Props) {
  const stats = [
    {
      title: "Recettes totales",
      value: totalIncome,
    },
    {
      title: "Dépenses totales",
      value: totalExpenses,
    },
    {
      title: "Solde global",
      value: balance,
    },
    {
      title: "Solde filtré",
      value: filteredBalance,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.title}
          </p>

          <p className="mt-3 text-3xl font-extrabold text-gray-950">
            {stat.value} €
          </p>
        </div>
      ))}
    </div>
  );
}