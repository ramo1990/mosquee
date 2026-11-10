
type Props = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}