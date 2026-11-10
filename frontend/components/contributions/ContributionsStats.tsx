type Props = {
  totalExpected: number;
  totalPaid: number;
  pendingCount: number;
  paidCount: number;
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

export default function ContributionsStats({
  totalExpected,
  totalPaid,
  pendingCount,
  paidCount,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total attendu"
        value={totalExpected}
        prefix="€"
      />

      <StatCard
        title="Total encaissé"
        value={totalPaid}
        prefix="€"
      />

      <StatCard
        title="En attente"
        value={pendingCount}
      />

      <StatCard
        title="Payées"
        value={paidCount}
      />
    </div>
  );
}