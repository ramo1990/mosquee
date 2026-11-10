
type Props = {
  total: number;
  active: number;
  inactive: number;
  groups: number;
};

export default function DisplayScheduleStats({
  total,
  active,
  inactive,
  groups,
}: Props) {
  const stats = [
    { title: "Total programmations", value: total },
    { title: "Actives", value: active },
    { title: "Inactives", value: inactive },
    { title: "Groupes d'écrans", value: groups },
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