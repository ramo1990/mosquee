
"use client";

import { useEffect, useState } from "react";
import type { PrayerTime } from "@/lib/types";
import { apiGet } from "@/lib/api";


import {
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Info,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const PRAYERS = [
  {
    key: "fajr",
    iqamaKey: "fajr_iqama",
    label: "Fajr",
    name: "Prière de l'aube",
    icon: Moon,
  },
  {
    key: "dhuhr",
    iqamaKey: "dhuhr_iqama",
    label: "Dhuhr",
    name: "Prière de midi",
    icon: Sun,
  },
  {
    key: "asr",
    iqamaKey: "asr_iqama",
    label: "Asr",
    name: "Prière de l'après-midi",
    icon: Sunrise,
  },
  {
    key: "maghrib",
    iqamaKey: "maghrib_iqama",
    label: "Maghrib",
    name: "Prière du coucher du soleil",
    icon: Sunset,
  },
  {
    key: "isha",
    iqamaKey: "isha_iqama",
    label: "Isha",
    name: "Prière de la nuit",
    icon: Moon,
  },
] as const;

type Props = {
  initialPrayerTime?: PrayerTime | null;
  isGeneral?: boolean;
};

function parsePrayerTime(time: string, now: Date) {
  if (!time) return null;

  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(
    time.trim()
  );

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);

  if (
    hours > 23 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return null;
  }

  const date = new Date(now);

  date.setHours(hours, minutes, seconds, 0);

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
  initialPrayerTime = null,
  isGeneral = true,
}: Props) {
  const [prayerTime, setPrayerTime] = useState<PrayerTime | null>(initialPrayerTime);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let cancelled = false;

    async function loadPrayerTimes() {
      setLoading(true);
      setError(false);

      try {
        // Page d'accueil : horaires généraux.
        // Page mosquée : horaires transmis ou chargés par le parent.
        const data = initialPrayerTime
          ? initialPrayerTime
          : await apiGet<PrayerTime>(
              "/horaires-prieres/today/"
            );

        if (!cancelled) {
          setPrayerTime(data);
        }
      } catch (error) {
        console.error("Erreur chargement horaires :", error);

        if (!cancelled) {
          setError(true);
          setPrayerTime(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrayerTimes();

    return () => {
      cancelled = true;
    };
  }, [initialPrayerTime]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-40 rounded-3xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {PRAYERS.map((prayer) => (
            <div
              key={prayer.key}
              className="h-48 rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !prayerTime) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-amber-600" />

        <h2 className="mt-3 font-bold text-amber-950">
          Horaires indisponibles
        </h2>

        <p className="mt-2 text-sm text-amber-800">
          Impossible de récupérer les horaires de prière.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white"
        >
          <RefreshCw size={16} className="mr-2 inline" />
          Réessayer
        </button>
      </div>
    );
  }

  if (!prayerTime) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-amber-600" />

        <h2 className="mt-3 font-bold text-amber-950">
          Horaires indisponibles
        </h2>

        <p className="mt-2 text-sm text-amber-800">
          Aucun horaire de prière n&apos;est actuellement disponible.
          Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }

  const validPrayers = PRAYERS
    .map((prayer) => {
      const time = prayerTime?.[prayer.key];

      if (!time) return null;

      const date = parsePrayerTime(time, now);

      if (!date) return null;

      return {
        ...prayer,
        time,
        date,
      };
    })
    .filter(
      (prayer): prayer is NonNullable<typeof prayer> =>
        prayer !== null
    );

  const nextPrayer = (() => {
    const upcoming = validPrayers.find(
      (prayer) => prayer.date.getTime() > now.getTime()
    );

    if (upcoming) return upcoming;

    const firstPrayer = validPrayers[0];

    if (!firstPrayer) return null;

    const tomorrow = new Date(firstPrayer.date);

    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      ...firstPrayer,
      date: tomorrow,
    };
  })();

  console.log("Horaires récupérés :", prayerTime);

  return (
    <div className="space-y-6">

      {/* PROCHAINE PRIÈRE */}

      {nextPrayer && (
        <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-lg sm:p-8">

          <div className="relative z-10">

            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Clock size={18} />
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

                <p className="mt-3 text-4xl font-bold">
                  {nextPrayer.time.slice(0, 5)}
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

          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-35 border-white/5" />

          <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full border-25 border-white/5" />

        </section>
      )}

      {!nextPrayer && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Aucun horaire de prière valide n&apos;est disponible.
        </div>
      )}

      {/* EN-TÊTE */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Les cinq prières
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isGeneral
              ? "Horaires généraux de référence."
              : "Horaires propres à cette mosquée."}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {now.toLocaleTimeString("fr-FR")}
        </div>

      </div>

      {/* CARTES */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {PRAYERS.map((prayer) => {
          const Icon = prayer.icon;

          const time = prayerTime?.[prayer.key];
          const iqama = prayerTime?.[prayer.iqamaKey];

          const isNext = nextPrayer?.key === prayer.key;

          return (
            <article
              key={prayer.key}
              className={`relative rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                isNext
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-gray-200 bg-white"
              }`}
            >

              {isNext && (
                <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-emerald-600" />
              )}

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
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

              <div className="mt-5 rounded-xl bg-gray-50 p-3">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Adhan
                </p>

                <p
                  className={`mt-1 text-2xl font-extrabold tabular-nums ${
                    isNext
                      ? "text-emerald-800"
                      : "text-gray-900"
                  }`}
                >
                  {time ? time.slice(0, 5) : "—"}
                </p>

              </div>

              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">

                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Iqama
                </p>

                <p className="mt-1 text-xl font-extrabold tabular-nums text-emerald-800">
                  {iqama
                    ? iqama.slice(0, 5)
                    : "Non renseignée"}
                </p>

              </div>

              {isNext && (
                <p className="mt-3 text-xs font-bold text-emerald-700">
                  <Clock size={13} className="mr-1 inline" />
                  Prochaine prière
                </p>
              )}

            </article>
          );
        })}

      </div>

      {/* INFORMATION */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

        <Info
          size={19}
          className="mt-0.5 shrink-0 text-blue-700"
        />

        <p className="text-sm leading-relaxed text-blue-900">
          {isGeneral
            ? "Ces horaires sont les horaires généraux de référence."
            : "Ces horaires sont communiqués par cette mosquée. Contactez son administration pour toute modification."}
        </p>

      </div>

    </div>
  );
}