// src/components/PrayerTimesToday.tsx
import { apiGet } from "@/lib/api";
import type { PrayerTime } from "@/lib/types";

export default async function PrayerTimesToday() {
  const prayerTime = await apiGet<PrayerTime>("/horaires-prieres/today/");

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {[
        ["Fajr", prayerTime.fajr],
        ["Dhuhr", prayerTime.dhuhr],
        ["Asr", prayerTime.asr],
        ["Maghrib", prayerTime.maghrib],
        ["Isha", prayerTime.isha],
      ].map(([label, time]) => (
        <div
          key={label}
          className="rounded-2xl border bg-white p-4 text-center shadow-sm"
        >
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-bold">{time}</p>
        </div>
      ))}
    </div>
  );
}