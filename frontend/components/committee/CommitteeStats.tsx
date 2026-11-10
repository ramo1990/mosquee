type Props = {
  membersCount: number;
  activeCount: number;
  inactiveCount: number;
};

export default function CommitteeStats({
  membersCount,
  activeCount,
  inactiveCount,
}: Props) {
  const stats = [
    {
      title: "Membres du comité",
      value: membersCount,
    },
    {
      title: "Comptes actifs",
      value: activeCount,
    },
    {
      title: "Comptes inactifs",
      value: inactiveCount,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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