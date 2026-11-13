
type DonationsStatsProps = {
  totalReceived: number;
  receivedCount: number;
  pendingCount: number;
  projectsCount: number;
};

export default function DonationsStats({
  totalReceived,
  receivedCount,
  pendingCount,
  projectsCount,
}: DonationsStatsProps) {
  const stats = [
    {
      title: "Total collecté",
      value: `${totalReceived.toLocaleString("fr-FR")} FCFA`,
      description: "Dons effectivement reçus",
      icon: "💰",
      color: "emerald",
    },
    {
      title: "Dons reçus",
      value: receivedCount.toString(),
      description: "Contributions confirmées",
      icon: "🤲",
      color: "blue",
    },
    {
      title: "En attente",
      value: pendingCount.toString(),
      description: "Dons à confirmer",
      icon: "⏳",
      color: "amber",
    },
    {
      title: "Projets concernés",
      value: projectsCount.toString(),
      description: "Projets ayant reçu des dons",
      icon: "🏗️",
      color: "purple",
    },
  ];

  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              {stat.title}
            </p>

            <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colors[stat.color]}`}>
              {stat.icon}
            </span>
          </div>

          <p className="mt-5 text-2xl font-extrabold tracking-tight text-gray-950">
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}