
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { Announcement, PrayerTime } from "@/lib/types";

const TIME_ZONE = "Africa/Abidjan";
const DATA_REFRESH_INTERVAL = 60_000;
const ANNOUNCEMENT_DURATION = 15_000;

const prayers = [
  { key: "fajr", label: "Fajr", arabic: "الفجر" },
  { key: "dhuhr", label: "Dhuhr", arabic: "الظهر" },
  { key: "asr", label: "Asr", arabic: "العصر" },
  { key: "maghrib", label: "Maghrib", arabic: "المغرب" },
  { key: "isha", label: "Isha", arabic: "العشاء" },
] as const;

const clockFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getClock(date: Date | null) {
  return date ? clockFormatter.format(date) : "--:--:--";
}

function getDate(date: Date | null) {
  if (!date) return "Chargement de la date...";
  return dateFormatter.format(date);
}

function getPrayerTime(
  prayerTime: PrayerTime | null,
  key: (typeof prayers)[number]["key"]
) {
  if (!prayerTime) return "--:--";
  return prayerTime[key] || "--:--";
}


type NextPrayer = {
  label: string;
  arabic: string;
  time: string;
  remainingMs: number;
};

function getAbidjanTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  ) as Record<string, number>;
}

function getNextPrayer(
  prayerTime: PrayerTime | null,
  now: Date | null
): NextPrayer | null {
  if (!prayerTime || !now) return null;

  const parts = getAbidjanTimeParts(now);

  // On construit une date de référence à partir de l'heure d'Abidjan.
  const today = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day)
  );

  const currentMinutes = parts.hour * 60 + parts.minute;
  const currentSeconds = parts.second;

  const todayPrayers = prayers
    .map((prayer) => {
      const value = prayerTime[prayer.key];

      if (!value || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
        return null;
      }

      const [hour, minute, second = "0"] = value.split(":").map(Number);

      if (
        hour > 23 ||
        minute > 59 ||
        Number(second) > 59
      ) {
        return null;
      }

      return {
        ...prayer,
        time: value.slice(0, 5),
        minutes: hour * 60 + minute,
        seconds: Number(second),
      };
    })
    .filter((prayer) => prayer !== null)
    .sort((a, b) => a.minutes - b.minutes || a.seconds - b.seconds);

  const next = todayPrayers.find(
    (prayer) =>
      prayer.minutes > currentMinutes ||
      (prayer.minutes === currentMinutes &&
        prayer.seconds > currentSeconds)
  );

  const selected = next ?? todayPrayers[0];

  if (!selected) return null;

  const targetDate = new Date(today);

  if (!next) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  }

  targetDate.setUTCHours(
    Math.floor(selected.minutes / 60),
    selected.minutes % 60,
    selected.seconds,
    0
  );

  // L'heure d'Abidjan est UTC+0 : cette conversion est directe.
  const remainingMs = targetDate.getTime() - Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return {
    label: selected.label,
    arabic: selected.arabic,
    time: selected.time,
    remainingMs,
  };
}

function formatCountdown(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}


function LoadingMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-lg text-gray-400"
    >
      {children}
    </div>
  );
}

export default function MosqueScreenPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prayerTime, setPrayerTime] = useState<PrayerTime | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const [prayersLoaded, setPrayersLoaded] = useState(false);

  const [announcementsError, setAnnouncementsError] = useState(false);
  const [prayersError, setPrayersError] = useState(false);
  const nextPrayer = getNextPrayer(prayerTime, now);

  const shuruqTime = prayerTime?.sunrise?.slice(0, 5) ?? "--:--";
  const jumuahTime = prayerTime?.jumuah_time?.slice(0, 5) ?? "--:--";

  const loadData = useCallback(async () => {
    const [announcementsResult, prayersResult] = await Promise.allSettled([
      apiGet<Announcement[]>("/annonces/screen/"),
      apiGet<PrayerTime>("/horaires-prieres/today/"),
    ]);

    if (announcementsResult.status === "fulfilled") {
      const nextAnnouncements = announcementsResult.value;

      setAnnouncements(nextAnnouncements);
      setCurrentIndex((index) =>
        nextAnnouncements.length > 0
          ? index % nextAnnouncements.length
          : 0
      );
      setAnnouncementsError(false);
    } else {
      setAnnouncementsError(true);
    }

    setAnnouncementsLoaded(true);

    if (prayersResult.status === "fulfilled") {
      setPrayerTime(prayersResult.value);
      setPrayersError(false);
    } else {
      setPrayersError(true);
    }

    setPrayersLoaded(true);
  }, []);

  // Horloge et actualisation des données.
  useEffect(() => {
    let active = true;
    let loading = false;

    const updateClock = () => {
      if (active) {
        setNow(new Date());
      }
    };

    const refreshData = async () => {
      if (!active || loading) return;

      loading = true;

      try {
        await loadData();
      } catch {
        // Les erreurs de chaque endpoint sont gérées par loadData.
      } finally {
        loading = false;
      }
    };

    updateClock();
    void refreshData();

    const clockInterval = window.setInterval(updateClock, 1000);
    const dataInterval = window.setInterval(
      refreshData,
      DATA_REFRESH_INTERVAL
    );

    return () => {
      active = false;
      window.clearInterval(clockInterval);
      window.clearInterval(dataInterval);
    };
  }, [loadData]);

  // Rotation automatique des annonces.
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % announcements.length);
    }, ANNOUNCEMENT_DURATION);

    return () => window.clearInterval(interval);
  }, [announcements.length]);

  const currentAnnouncement =
    announcements.length > 0
      ? announcements[currentIndex % announcements.length]
      : undefined;

  const isUrgent = currentAnnouncement?.priority === "high";

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#07110e] px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.5rem,1vh,1rem)] text-white">
      {/* En-tête et horloge */}
      <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
            Côte d’Ivoire
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Mosquée<span className="text-amber-400">.</span>
          </h1>

          <p className="mt-2 text-sm capitalize text-gray-400 sm:text-base">
            {getDate(now)}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Heure locale
          </p>

          <time
            className="mt-1 block text-4xl font-bold tabular-nums tracking-tight text-emerald-300 sm:text-5xl lg:text-6xl"
            suppressHydrationWarning
          >
            {getClock(now)}
          </time>

          {/* <p className="mt-1 text-xs text-gray-500">
            Africa/Abidjan · GMT
          </p> */}
        </div>
      </header>

      
      {/* Shuruq · Prochaine prière · Jumua */}
      <section className="mt-[clamp(1rem,2vh,2rem)] grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)_minmax(0,0.85fr)] items-baseline-last gap-[clamp(0.75rem,1.5vw,2rem)]">

        {/* SHURUQ à gauche */}
        <article className="flex min-w-0 flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-950/60 px-4 py-5 text-center">
          <p className="text-[clamp(0.85rem,1.3vw,1.4rem)] font-bold uppercase tracking-[0.15em] text-amber-300">
            SHURUQ
          </p>

          <p className="mt-[clamp(0.5rem,1.5vh,1.25rem)] text-[clamp(1.75rem,3vw,3.5rem)] font-bold tabular-nums text-white">
            {shuruqTime}
          </p>

          <p className="mt-2 text-[clamp(0.75rem,1vw,1.15rem)] text-gray-400">
            Lever du soleil
          </p>
        </article>

        {/* PROCHAINE PRIÈRE au centre */}
        <article className="flex min-w-0 flex-col items-center justify-center rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-emerald-800 to-emerald-950 px-8 py-10 text-center shadow-xl">
          <p className="text-xl font-bold uppercase tracking-[0.25em] text-amber-300">
            PROCHAINE PRIÈRE
          </p>

          {nextPrayer ? (
            <>
              <h2 className="mt-5 text-6xl font-extrabold">
                {nextPrayer.label}
              </h2>

              <p lang="ar" dir="rtl" className="mt-2 text-3xl text-emerald-200">
                {nextPrayer.arabic}
              </p>

              <p className="mt-4 text-3xl font-semibold tabular-nums">
                {nextPrayer.time}
              </p>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Temps restant
              </p>

              <p className="mt-2 font-mono text-5xl font-bold tabular-nums text-amber-300">
                {formatCountdown(nextPrayer.remainingMs)}
              </p>
            </>
          ) : (
            <p className="mt-5 text-2xl text-gray-300">
              {!prayersLoaded
                ? "Chargement des horaires..."
                : "Horaires indisponibles"}
            </p>
          )}
        </article>

        {/* JUMUA à droite */}
        <article className="flex min-w-0 flex-col items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-950/40 px-4 py-5 text-center">
          <p className="text-xl font-bold uppercase tracking-[0.25em] text-amber-300">
            JUMUA
          </p>

          <p className="mt-5 text-5xl font-bold tabular-nums text-white">
            {jumuahTime}
          </p>

          <p className="mt-3 text-lg text-gray-400">
            Prière du vendredi
          </p>

          {prayerTime?.jumuah_khateeb && (
            <p className="mt-4 text-base text-gray-300">
              Khatib : {prayerTime.jumuah_khateeb}
            </p>
          )}
        </article>

      </section>


      {/* Annonces */}
      <section
        aria-labelledby="announcements-heading"
        className="mt-[clamp(0.5rem,1vh,1rem)] flex min-h-0 flex-1 flex-col"
      >
        <div className="mb-[clamp(0.5rem,1vh,1rem)] flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="announcements-heading"
              className="text-[clamp(1.1rem,1.8vw,2rem)] font-bold"
            >
              Informations de la communauté
            </h2>
          </div>

          {announcements.length > 0 && (
            <p
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm tabular-nums text-gray-300"
              aria-label={`Annonce ${currentIndex + 1} sur ${announcements.length}`}
            >
              {currentIndex + 1} / {announcements.length}
            </p>
          )}
        </div>


        <div
          aria-live="polite"
          aria-atomic="true"
          className={`relative flex min-h-0 flex-1 flex-col justify-center overflow-hidden rounded-3xl border p-[clamp(0.75rem,1.5vw,2rem)] ${
            isUrgent
              ? "border-red-500/40 bg-gradient-to-br from-red-950 via-red-950 to-[#210b0b]"
              : "border-emerald-500/20 bg-gradient-to-br from-[#10271f] to-[#0b1914]"
          }`}
        >
          {isUrgent && (
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1.5 bg-red-500"
            />
          )}

          {currentAnnouncement ? (
            <article
              key={currentAnnouncement.id}
              className="mx-auto w-full max-w-7xl animate-in fade-in duration-500"
            >
              {isUrgent && (
                <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold tracking-wider text-white sm:text-sm">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-white"
                  />
                  ANNONCE URGENTE
                </span>
              )}

              <h3 className="break-words text-[clamp(1.1rem,2.2vw,2.8rem)] font-bold leading-tight tracking-tight">
                {currentAnnouncement.title}
              </h3>

              <p className="mt-[clamp(0.4rem,1vh,0.9rem)] whitespace-pre-line break-words text-[clamp(0.9rem,1.35vw,1.65rem)] leading-snug text-gray-200">
                {currentAnnouncement.body}
              </p>
            </article>
          ) : !announcementsLoaded ? (
            <div className="py-4 text-center">
              <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-gray-300">
                Chargement des annonces...
              </p>
            </div>
          ) : announcementsError ? (
            <div className="py-4 text-center">
              <h3 className="text-[clamp(1rem,1.5vw,1.5rem)] font-semibold text-gray-200">
                Annonces temporairement indisponibles
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Une nouvelle tentative sera effectuée automatiquement.
              </p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-semibold text-gray-200">
                Aucune annonce pour le moment
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Les prochaines informations apparaîtront ici.
              </p>
            </div>
          )}

          {announcements.length > 1 && (
            <div
              className="mt-[clamp(0.5rem,1vh,1rem)] flex shrink-0 items-center justify-center gap-2"
              aria-hidden="true"
            >
              {announcements.slice(0, 12).map((announcement, index) => (
                <span
                  key={announcement.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-emerald-400"
                      : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Pied d'écran */}
      <footer className="mt-2 flex shrink-0 flex-col items-center justify-between gap-1 border-t border-white/10 pt-2 text-[clamp(0.65rem,0.8vw,0.8rem)] text-gray-500 sm:flex-row">
        <p>Foi · Paix · Fraternité</p>
        <p>Qu’Allah bénisse notre communauté.</p>
      </footer>
    </main>
  );
}
