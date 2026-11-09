
import StatCard from "./StatCard";

type Props = {
  total: number;
  active: number;
  inactive: number;
  students: number;
};

export default function ClassroomStats({
  total,
  active,
  inactive,
  students,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total classes" value={total} />
      <StatCard title="Classes actives" value={active} />
      <StatCard title="Classes inactives" value={inactive} />
      <StatCard title="Élèves affectés" value={students} />
    </div>
  );
}
