
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

type ApiPrayerTime = {
  id: number;
  mosque: string | null;
  date: string;
  fajr: string;
  sunrise: string | null;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajr_iqama: string | null;
  dhuhr_iqama: string | null;
  asr_iqama: string | null;
  maghrib_iqama: string | null;
  isha_iqama: string | null;
  jumuah_time: string | null;
  jumuah_khateeb: string | null;
};

type Prayer = {
  name: string;
  time: string;
  iqama?: string | null;
  icon: React.ElementType;
};

const MOSQUE_SLUG: string | null = null;

// null = horaires généraux
// Exemple : "mosquee-abidjan" = horaires de cette mosquée

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function mapPrayerTimes(data: ApiPrayerTime): Prayer[] {
  return [
    { name: "Fajr", time: data.fajr, iqama: data.fajr_iqama, icon: Moon },
    { name: "Dhuhr", time: data.dhuhr, iqama: data.dhuhr_iqama, icon: Sun },
    { name: "Asr", time: data.asr, iqama: data.asr_iqama, icon: Sunrise },
    { name: "Maghrib", time: data.maghrib, iqama: data.maghrib_iqama, icon: Sunset },
    { name: "Isha", time: data.isha, iqama: data.isha_iqama, icon: Moon },
  ];
}


function getNextPrayer(prayers: Prayer[], now: Date) {
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(":").map(Number);

    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);

    if (date > now) {
      return { ...prayer, date };
    }
  }

  // Toutes les prières du jour sont passées.
  // La prochaine sera Fajr demain.

  const firstPrayer = prayers[0];

  if (!firstPrayer) return null;

  const [hours, minutes] = firstPrayer.time.split(":").map(Number);

  const date = new Date(now);
  date.setDate(date.getDate() + 1);
  date.setHours(hours, minutes, 0, 0);

  return { ...firstPrayer, date };
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

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [jumuahTime, setJumuahTime] = useState<string | null>(null);
  const [jumuahKhateeb, setJumuahKhateeb] = useState<string | null>(null);
  const [location, setLocation] = useState("Côte d'Ivoire");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPrayerTimes() {
      try {
        setLoading(true);
        setError(null);

        const endpoint = MOSQUE_SLUG
          ? `${API_URL}/horaires-prieres/mosque/${MOSQUE_SLUG}/today/`
          : `${API_URL}/horaires-prieres/today/`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Aucun horaire de prière disponible."
              : "Impossible de récupérer les horaires."
          );
        }

        const data: ApiPrayerTime = await response.json();

        setPrayers(mapPrayerTimes(data));
        setJumuahTime(data.jumuah_time);
        setJumuahKhateeb(data.jumuah_khateeb);

        setLocation(
          data.mosque
            ? `Mosquée : ${data.mosque}`
            : "Horaires généraux — Côte d'Ivoire"
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPrayerTimes();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNow(new Date());
    }, 0);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!now) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  const nextPrayer = getNextPrayer(prayers, now);
  const today = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Info className="h-10 w-10 text-red-500" />

        <h2 className="text-xl font-bold text-gray-900">
          Impossible de charger les horaires
        </h2>

        <p className="text-center text-sm text-gray-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white"
        >
          Réessayer
        </button>
      </main>
    );
  }

  if (!now) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  if (prayers.length === 0 || !nextPrayer) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        Aucun horaire disponible.
      </main>
    );
  }

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
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 to-emerald-950 p-7 text-white shadow-lg sm:p-10">
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

          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-35 border-white/5" />
          <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full border-30 border-white/5" />
        </section>

        {/* DATE ET LOCALISATION */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <CalendarDays size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                Aujourd&apos;hui
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
                {location}
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
            
                  {/* HORAIRES */}
                  <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-7">
                      <h2 className="text-xl font-extrabold text-gray-900">
                        Les cinq prières
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Horaires de l&apos;Adhan et de l&apos;Iqama
                      </p>
                    </div>

                    <div className="space-y-3">
                      {prayers.map((prayer) => {
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
                      {/* NOM ET ICÔNE */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            isNext
                              ? "bg-emerald-800 text-white"
                              : "bg-white text-emerald-700"
                          }`}
                        >
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

                      {/* ADHAN ET IQAMA */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Adhan
                          </p>

                          <p
                            className={`text-xl font-extrabold tabular-nums ${
                              isNext ? "text-emerald-800" : "text-gray-800"
                            }`}
                          >
                            {prayer.time.slice(0, 5)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                            Iqama
                          </p>

                          <p className="text-sm font-bold tabular-nums text-emerald-800">
                            {prayer.iqama
                              ? prayer.iqama.slice(0, 5)
                              : "Non renseignée"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
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
                Prière du vendredi (Joumou&apos;a)
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Retrouvez-vous chaque vendredi pour la prière
                collective et le sermon à la mosquée.
              </p>

              <p className="mt-3 text-sm font-bold text-amber-800">
                {jumuahTime
                  ? `Horaire : ${jumuahTime.slice(0, 5)}`
                  : "Horaire à confirmer auprès de votre mosquée."}
              </p>

              {jumuahKhateeb && (
                <p className="mt-2 text-sm text-gray-600">
                  Prédicateur : {jumuahKhateeb}
                </p>
              )}
            </div>
          </div>
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