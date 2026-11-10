
type Props = {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  imamCount: number;
};

export default function SermonsStats({
  totalCount,
  publishedCount,
  draftCount,
  imamCount,
}: Props) {
  const stats = [
    { title: "Total sermons", value: totalCount },
    { title: "Publiés", value: publishedCount },
    { title: "Brouillons", value: draftCount },
    { title: "Imams disponibles", value: imamCount },
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