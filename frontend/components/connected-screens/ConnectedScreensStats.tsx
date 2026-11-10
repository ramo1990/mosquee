
"use client";

type Props = {
  total: number;
  connected: number;
  disconnected: number;
  maintenance: number;
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
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}

export default function ConnectedScreensStats({
  total,
  connected,
  disconnected,
  maintenance,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total écrans"
        value={total}
      />

      <StatCard
        title="Connectés"
        value={connected}
      />

      <StatCard
        title="Déconnectés"
        value={disconnected}
      />

      <StatCard
        title="En maintenance"
        value={maintenance}
      />
    </div>
  );
}