
"use client";

import { TYPE_OPTIONS } from "./types";

type Props = {
  total: number;
  published: number;
  drafts: number;
};

export default function ReligiousAnnouncementsStats({
  total,
  published,
  drafts,
}: Props) {
  const stats = [
    {
      title: "Total annonces",
      value: total,
    },
    {
      title: "Publiées",
      value: published,
    },
    {
      title: "Brouillons",
      value: drafts,
    },
    {
      title: "Types disponibles",
      value: TYPE_OPTIONS.length,
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