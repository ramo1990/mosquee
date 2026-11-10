
type Props = {
  eventsCount: number;
  courseCount: number;
  examCount: number;
  classroomsCount: number;
};

export default function CourseCalendarStats({
  eventsCount,
  courseCount,
  examCount,
  classroomsCount,
}: Props) {
  const stats = [
    { title: "Événements", value: eventsCount },
    { title: "Cours", value: courseCount },
    { title: "Évaluations", value: examCount },
    { title: "Classes", value: classroomsCount },
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