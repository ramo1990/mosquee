
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CalendarDays,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";

type Prayer = {
  name: string;
  time: string;
  icon: React.ElementType;
};

const PRAYERS: Prayer[] = [
  { name: "Fajr", time: "05:45", icon: Moon },
  { name: "Dhuhr", time: "13:15", icon: Sun },
  { name: "Asr", time: "16:30", icon: Sunrise },
  { name: "Maghrib", time: "18:05", icon: Sunset },
  { name: "Isha", time: "19:30", icon: Moon },
];

function getNextPrayer() {
  const now = new Date();

  for (const prayer of PRAYERS) {
    const [hours, minutes] = prayer.time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    if (date > now) {
      return { ...prayer, date };
    }
  }

  const [hours, minutes] = PRAYERS[0].time.split(":").map(Number);
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hours, minutes, 0, 0);

  return { ...PRAYERS[0], date };
}

function formatCountdown(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PrayerTimesPage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  const nextPrayer = getNextPrayer();
  const today = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">

        {/* EN-TÊTE */}
        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Clock size={18} />
            Vie religieuse
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Horaires de prière
          </h1>

          <p className="mt-2 text-gray-500">
            Retrouvez les horaires des cinq prières quotidiennes.
          </p>
        </section>

        {/* PROCHAINE PRIÈRE */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-7 text-white shadow-lg sm:p-10">
          <div className="relative z-10">
            <p className="text-sm font-semibold text-emerald-200">
              Prochaine prière
            </p>

            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
              {nextPrayer.name}
            </h2>

            <p className="mt-2 text-2xl font-bold text-emerald-200">
              {nextPrayer.time}
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <Clock size={22} />

              <div>
                <p className="text-xs text-emerald-200">
                  Temps restant
                </p>

                <p className="text-2xl font-extrabold tabular-nums">
                  {formatCountdown(nextPrayer.date, now)}
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full border-[30px] border-white/5" />
        </section>

        {/* DATE ET LOCALISATION */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <CalendarDays size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                Aujourd'hui
              </p>

              <p className="mt-1 font-bold capitalize text-gray-900">
                {today}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <MapPin size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                Localisation
              </p>

              <p className="mt-1 font-bold text-gray-900">
                Côte d&apos;Ivoire
              </p>
            </div>
          </div>
        </section>

        {/* HORAIRES */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-extrabold text-gray-900">
              Les cinq prières
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Horaires journaliers
            </p>
          </div>

          <div className="space-y-3">
            {PRAYERS.map((prayer) => {
              const Icon = prayer.icon;
              const isNext = prayer.name === nextPrayer.name;

              return (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                    isNext
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      isNext
                        ? "bg-emerald-800 text-white"
                        : "bg-white text-emerald-700"
                    }`}>
                      <Icon size={23} />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        {prayer.name}
                      </p>

                      {isNext && (
                        <p className="mt-1 text-xs font-bold text-emerald-700">
                          Prochaine prière
                        </p>
                      )}
                    </div>
                  </div>

                  <p className={`text-xl font-extrabold tabular-nums ${
                    isNext ? "text-emerald-800" : "text-gray-800"
                  }`}>
                    {prayer.time}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* VENDREDI */}
        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Sun size={24} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Prière du vendredi (Joumou'a)
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Retrouvez-vous chaque vendredi pour la prière
                collective et le sermon à la mosquée.
              </p>

              <p className="mt-3 text-sm font-bold text-amber-800">
                Horaire à confirmer auprès de votre mosquée.
              </p>
            </div>
          </div>
        </section>

        {/* INFORMATION */}
        <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <Info className="mt-0.5 shrink-0 text-blue-700" size={20} />

          <p className="text-sm leading-relaxed text-blue-900">
            Les horaires présentés sont des exemples de démonstration.
            Ils doivent être remplacés par les horaires officiels
            calculés ou configurés pour votre mosquée.
          </p>
        </section>

        {/* LIENS */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/evenements"
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 font-bold text-gray-800 shadow-sm transition hover:border-emerald-200"
          >
            <span>Découvrir les événements</span>
            <ChevronRight className="text-emerald-700" />
          </Link>

          <Link
            href="/actualites"
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 font-bold text-gray-800 shadow-sm transition hover:border-emerald-200"
          >
            <span>Voir les actualités</span>
            <ChevronRight className="text-emerald-700" />
          </Link>
        </section>

      </div>
    </main>
  );
}