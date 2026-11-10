
"use client";

type ActivitiesStatsProps = {
  stats: {
    planned: number;
    ongoing: number;
    completed: number;
    published: number;
  };
};

export default function ActivitiesStats({
  stats,
}: ActivitiesStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Planifiées" value={stats.planned} />
      <StatCard title="En cours" value={stats.ongoing} />
      <StatCard title="Terminées" value={stats.completed} />
      <StatCard title="Publiées" value={stats.published} />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}