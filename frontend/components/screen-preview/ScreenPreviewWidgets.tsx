
"use client";

import type { PrayerTimes } from "./types";

export function ScreenClock({
  time,
  date,
}: {
  time: string;
  date: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-bold text-gray-900">Horloge</h3>

      <p className="mt-4 text-4xl font-extrabold text-gray-950">
        {time}
      </p>

      <p className="mt-2 text-sm capitalize text-gray-500">
        {date}
      </p>
    </div>
  );
}

export function PrayerTimesWidget({
  prayerTimes,
}: {
  prayerTimes: PrayerTimes | null;
}) {
  const prayers = [
    ["Fajr", prayerTimes?.fajr],
    ["Dhuhr", prayerTimes?.dhuhr],
    ["Asr", prayerTimes?.asr],
    ["Maghrib", prayerTimes?.maghrib],
    ["Isha", prayerTimes?.isha],
    ["Jumua", prayerTimes?.jumua_time],
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-bold text-gray-900">
        Horaires de prière
      </h3>

      {prayerTimes ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {prayers.map(([label, time]) => (
            <div
              key={label}
              className="rounded-xl bg-gray-50 p-3 text-center"
            >
              <p className="text-xs font-semibold text-gray-500">
                {label}
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {time || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Aucun horaire disponible pour cet écran.
        </p>
      )}
    </div>
  );
}