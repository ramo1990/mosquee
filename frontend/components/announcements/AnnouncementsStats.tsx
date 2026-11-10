
type Props = {
  stats: {
    total: number;
    published: number;
    drafts: number;
    screens: number;
  };
};

export default function AnnouncementsStats({ stats }: Props) {
  const cards = [
    { title: "Total annonces", value: stats.total },
    { title: "Publiées", value: stats.published },
    { title: "Brouillons", value: stats.drafts },
    { title: "Affichées", value: stats.screens },
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