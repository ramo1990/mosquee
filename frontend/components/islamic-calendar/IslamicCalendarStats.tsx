
"use client";

type Props = {
  total: number;
  active: number;
  inactive: number;
  types: number;
};

export default function IslamicCalendarStats({
  total,
  active,
  inactive,
  types,
}: Props) {
  const stats = [
    {
      title: "Total événements",
      value: total,
    },
    {
      title: "Événements actifs",
      value: active,
    },
    {
      title: "Événements inactifs",
      value: inactive,
    },
    {
      title: "Types d'événements",
      value: types,
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
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}