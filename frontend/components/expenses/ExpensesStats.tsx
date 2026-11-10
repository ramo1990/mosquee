
"use client";

type Props = {
  totalExpenses: number;
  pendingCount: number;
  approvedCount: number;
  categoriesCount: number;
};

export default function ExpensesStats({
  totalExpenses,
  pendingCount,
  approvedCount,
  categoriesCount,
}: Props) {
  const stats = [
    {
      title: "Total payé",
      value: totalExpenses,
      prefix: "€",
    },
    {
      title: "En attente",
      value: pendingCount,
    },
    {
      title: "Validées",
      value: approvedCount,
    },
    {
      title: "Catégories",
      value: categoriesCount,
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
            {stat.prefix}
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}