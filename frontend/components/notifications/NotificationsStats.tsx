type Props = {
  total: number;
  unread: number;
  read: number;
};

export default function NotificationsStats({
  total,
  unread,
  read,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Total notifications"
        value={total}
      />

      <StatCard
        title="Non lues"
        value={unread}
      />

      <StatCard
        title="Lues"
        value={read}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}