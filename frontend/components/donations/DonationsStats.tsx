type Props = {
  totalReceived: number;
  receivedCount: number;
  pendingCount: number;
  projectsCount: number;
};

function StatCard({
  title,
  value,
  prefix,
}: {
  title: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {prefix}
        {value}
      </p>
    </div>
  );
}

export default function DonationsStats({
  totalReceived,
  receivedCount,
  pendingCount,
  projectsCount,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total reçu"
        value={totalReceived}
        prefix="€"
      />

      <StatCard
        title="Dons reçus"
        value={receivedCount}
      />

      <StatCard
        title="Dons en attente"
        value={pendingCount}
      />

      <StatCard
        title="Projets"
        value={projectsCount}
      />
    </div>
  );
}