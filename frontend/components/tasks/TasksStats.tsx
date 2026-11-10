
type TasksStatsProps = {
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  totalCount: number;
};

export default function TasksStats({
  todoCount,
  inProgressCount,
  doneCount,
  totalCount,
}: TasksStatsProps) {
  const stats = [
    { title: "À faire", value: todoCount },
    { title: "En cours", value: inProgressCount },
    { title: "Terminées", value: doneCount },
    { title: "Total tâches", value: totalCount },
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