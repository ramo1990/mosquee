
"use client";

import { SlideStats } from "./types";

type Props = {
  stats: SlideStats;
};

export default function SlidesStats({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total diapositives"
        value={stats.total}
      />

      <StatCard
        title="Publiées"
        value={stats.published}
      />

      <StatCard
        title="Brouillons"
        value={stats.drafts}
      />

      <StatCard
        title="Groupes d’écrans"
        value={stats.groups}
      />
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
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}