
type Props = {
  total: number;
  imams: number;
  teachers: number;
  active: number;
};

export default function StaffStats({
  total,
  imams,
  teachers,
  active,
}: Props) {
  const stats = [
    { title: "Total", value: total },
    { title: "Imams", value: imams },
    { title: "Enseignants", value: teachers },
    { title: "Comptes actifs", value: active },
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
