
type Props = {
  studentsWithProgress: number;
  studentsWithoutProgress: number;
  averageScore: number;
  classroomsCount: number;
};

export default function StudentProgressStats({
  studentsWithProgress,
  studentsWithoutProgress,
  averageScore,
  classroomsCount,
}: Props) {
  const stats = [
    {
      title: "Élèves suivis",
      value: studentsWithProgress,
    },
    {
      title: "Élèves sans suivi",
      value: studentsWithoutProgress,
    },
    {
      title: "Moyenne générale",
      value: Number(averageScore.toFixed(2)),
    },
    {
      title: "Classes",
      value: classroomsCount,
    },
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