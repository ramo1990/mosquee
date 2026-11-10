
type Props = {
  planned: number;
  ongoing: number;
  completed: number;
  published: number;
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

export default function ReligiousEventsStats({
  planned,
  ongoing,
  completed,
  published,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Planifiés" value={planned} />
      <StatCard title="En cours" value={ongoing} />
      <StatCard title="Terminés" value={completed} />
      <StatCard title="Publiés" value={published} />
    </div>
  );
}