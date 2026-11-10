
type Props = {
  total: number;
  active: number;
  inactive: number;
  teachers: number;
};

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

export default function ReligiousCoursesStats({
  total,
  active,
  inactive,
  teachers,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total cours" value={total} />
      <StatCard title="Cours actifs" value={active} />
      <StatCard title="Cours inactifs" value={inactive} />
      <StatCard title="Enseignants disponibles" value={teachers} />
    </div>
  );
}