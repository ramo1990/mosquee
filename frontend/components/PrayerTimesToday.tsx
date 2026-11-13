
"use client";

import { useEffect, useState } from "react";
import type { PrayerTime } from "@/lib/types";
import {
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Loader2,
  Info,
  AlertCircle,
} from "lucide-react";

const PRAYERS = [
  {
    key: "fajr",
    label: "Fajr",
    name: "Prière de l'aube",
    icon: Moon,
  },
  {
    key: "dhuhr",
    label: "Dhuhr",
    name: "Prière de midi",
    icon: Sun,
  },
  {
    key: "asr",
    label: "Asr",
    name: "Prière de l'après-midi",
    icon: Sunrise,
  },
  {
    key: "maghrib",
    label: "Maghrib",
    name: "Coucher du soleil",
    icon: Sunset,
  },
  {
    key: "isha",
    label: "Isha",
    name: "Prière de la nuit",
    icon: Moon,
  },
] as const;

type Props = {
  prayerTime?: PrayerTime | null;
};

function parsePrayerTime(time: string, now: Date) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function formatCountdown(milliseconds: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

export default function PrayerTimesToday({
  prayerTime,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!prayerTime) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-600" />
        <h2 className="mt-3 font-bold text-amber-950">
          Horaires indisponibles
        </h2>
        <p className="mt-2 text-sm text-amber-800">
          Impossible de récupérer les horaires de prière.
          Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }

  const nextPrayer = (() => {
    for (const prayer of PRAYERS) {
      const time = prayerTime[prayer.key];

      if (!time) continue;

      const date = parsePrayerTime(time, now);

      if (date && date > now) {
        return {
          ...prayer,
          time,
          date,
        };
      }
    }

    const firstPrayer = PRAYERS.find(
      (prayer) => {
        const time = prayerTime[prayer.key];
        return Boolean(time && parsePrayerTime(time, now));
      }
    );

    if (!firstPrayer) return null;

    const firstTime = prayerTime[firstPrayer.key];

    if (!firstTime) return null;

    const date = parsePrayerTime(firstTime, now);

    if (!date) return null;

    date.setDate(date.getDate() + 1);

    return {
      ...firstPrayer,
      time: firstTime,
      date,
    };
  })();

  return (
    <div className="space-y-6">

      {/* PROCHAINE PRIÈRE */}
      {nextPrayer && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Clock size={17} />
              Prochaine prière
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-4xl font-extrabold">
                  {nextPrayer.label}
                </h2>

                <p className="mt-2 text-sm text-emerald-200">
                  {nextPrayer.name}
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {nextPrayer.time}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold text-emerald-200">
                  Temps restant
                </p>

                <p className="mt-2 text-3xl font-extrabold tabular-nums">
                  {formatCountdown(
                    nextPrayer.date.getTime() - now.getTime()
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full border-[25px] border-white/5" />
        </section>
      )}

      {!nextPrayer && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Aucun horaire de prière valide n'est disponible.
        </div>
      )}

      {/* EN-TÊTE */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Les cinq prières
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Horaires communiqués par votre mosquée.
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {now.toLocaleTimeString("fr-FR")}
        </div>
      </div>

      {/* CARTES */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PRAYERS.map((prayer) => {
          const Icon = prayer.icon;
          const time = prayerTime[prayer.key];
          const isNext = nextPrayer?.key === prayer.key;

          return (
            <article
              key={prayer.key}
              className={`relative rounded-2xl border p-5 text-center transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                isNext
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-gray-200 bg-white"
              }`}
            >
              {isNext && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-600" />
              )}

              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
                  isNext
                    ? "bg-emerald-800 text-white"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                <Icon size={23} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                {prayer.label}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {prayer.name}
              </p>

              <p
                className={`mt-4 text-2xl font-extrabold tabular-nums ${
                  isNext ? "text-emerald-800" : "text-gray-900"
                }`}
              >
                {time || "—"}
              </p>

              {isNext && (
                <p className="mt-2 text-xs font-bold text-emerald-700">
                  Prochaine prière
                </p>
              )}
            </article>
          );
        })}
      </div>

      {/* INFORMATION */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={19} className="mt-0.5 shrink-0 text-blue-700" />

        <p className="text-sm leading-relaxed text-blue-900">
          Les horaires sont ceux communiqués par votre mosquée.
          Pour toute modification, contactez l'administration.
        </p>
      </div>
    </div>
  );
}