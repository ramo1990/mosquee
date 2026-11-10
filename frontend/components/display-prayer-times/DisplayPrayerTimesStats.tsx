
"use client";

type Props = {
  stats: {
    total: number;
    published: number;
    drafts: number;
    groups: number;
  };
};

export default function DisplayPrayerTimesStats({
  stats,
}: Props) {
  const cards = [
    { title: "Journées", value: stats.total },
    { title: "Publiées", value: stats.published },
    { title: "Brouillons", value: stats.drafts },
    { title: "Groupes d’écrans", value: stats.groups },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>

          <p className="mt-3 text-3xl font-extrabold text-gray-950">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}