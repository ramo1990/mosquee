
import { AttendanceCounts } from "./types";

type Props = {
  counts: AttendanceCounts;
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

export default function AttendanceStats({ counts }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Présents" value={counts.present} />
      <StatCard title="Absents" value={counts.absent} />
      <StatCard title="Retards" value={counts.late} />
      <StatCard title="Justifiées" value={counts.excused} />
    </div>
  );
}