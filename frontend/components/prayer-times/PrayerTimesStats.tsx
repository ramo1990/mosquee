
import { PRAYER_FIELDS } from "./types";

type Props = {
  total: number;
  active: number;
  inactive: number;
};

export default function PrayerTimesStats({
  total,
  active,
  inactive,
}: Props) {
  const stats = [
    { title: "Journées enregistrées", value: total },
    { title: "Horaires actifs", value: active },
    { title: "Horaires inactifs", value: inactive },
    { title: "Prières quotidiennes", value: PRAYER_FIELDS.length },
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