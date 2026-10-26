
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGet, apiGetList } from "@/lib/api";
import type { Announcement, PrayerTime, QuranVerse, Event } from "@/lib/types";
import { useScreenSocket } from "@/lib/useScreenSocket";
import { useParams } from "next/navigation";


type ScreenSlide =
  | {
      type: "announcement";
      data: Announcement;
    }
  | {
      type: "verse";
      arabic: string;
      translation: string;
      reference: string;
    }
  | {
      type: "event";
      title: string;
      description: string;
      starts_at: string;
      location: string | null;
    };

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

export default function MosqueScreenPage() {
  const params = useParams();
  const screenId = Number(params.screenId);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prayerTime, setPrayerTime] = useState<PrayerTime | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const [prayersLoaded, setPrayersLoaded] = useState(false);

  const [announcementsError, setAnnouncementsError] = useState(false);
  const [prayersError, setPrayersError] = useState(false);
  const nextPrayer = getNextPrayer(prayerTime, now);

  const shuruqTime = prayerTime?.sunrise?.slice(0, 5) ?? "--:--";
  const jumuahTime = prayerTime?.jumuah_time?.slice(0, 5) ?? "--:--";

  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [versesLoaded, setVersesLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo<ScreenSlide[]>(() => {
    const result: ScreenSlide[] = [];

    announcements.forEach((announcement) => {
      result.push({ type: "announcement", data: announcement });
    });

    verses.forEach((verse) => {
      result.push({
        type: "verse",
        arabic: verse.arabic,
        translation: verse.translation,
        reference: verse.reference,
      });
    });

    events.slice(0, 3).forEach((event) => {
      result.push({
        type: "event",
        title: event.title,
        description: event.description,
        starts_at: event.starts_at,
        location: event.location,
      });
    });

    return result;
  }, [announcements, verses, events]);

  const loadData = useCallback(async () => {
    const [
      announcementsResult,
      prayersResult,
      versesResult,
      eventsResult,
    ] = await Promise.allSettled([
      apiGetList<Announcement>(`/annonces/screen/${screenId}/`),
      apiGet<PrayerTime>("/horaires-prieres/today/"),
      apiGetList<QuranVerse>("/versets/screen/"),
      apiGetList<Event>("/evenements/upcoming/"),
    ]);

    if (announcementsResult.status === "fulfilled") {
      const nextAnnouncements = announcementsResult.value;

      setAnnouncements(nextAnnouncements);
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

    if (versesResult.status === "fulfilled") {
      setVerses(
        versesResult.value.filter((verse) => verse.is_active)
      );
      setVersesLoaded(true);
    }

    if (eventsResult.status === "fulfilled") {
      setEvents(eventsResult.value);
      setEventsLoaded(true);
    }
  }, [screenId]);

  const { connected } = useScreenSocket(screenId, () => {
    void loadData();
  });

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
    if (slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % slides.length);
    }, ANNOUNCEMENT_DURATION);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const safeSlideIndex = slides.length > 0 ? slideIndex % slides.length : 0;
  const currentSlide = slides[safeSlideIndex];

  const isUrgent =
    currentSlide?.type === "announcement" &&
    currentSlide.data.priority === "high";

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#07110e] px-[clamp(0.5rem,2vw,2rem)] py-2 text-white">
      {/* En-tête et horloge */}
      <header className="flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            connected ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {connected ? "EN LIGNE" : "HORS LIGNE"}
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
            Côte d’Ivoire
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Mosquée<span className="text-amber-400">.</span>
          </h1>

          <p className="mt-1 text-sm capitalize text-gray-400 sm:text-base">
            {getDate(now)}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Heure locale
          </p>

          <time
            className="mt-0 block text-4xl font-bold tabular-nums tracking-tight text-emerald-300 sm:text-5xl lg:text-6xl"
            suppressHydrationWarning
          >
            {getClock(now)}
          </time>
        </div>
      </header>

      
      {/* Shuruq · Prochaine prière · Jumua */}
      <section className="grid shrink-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)_minmax(0,0.85fr)] items-center gap-[clamp(0.5rem,1.5vw,2rem)]">

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
        <article className="flex min-w-0 flex-col items-center justify-center rounded-3xl border-2 border-amber-400/40 bg-linear-to-br from-emerald-800 to-emerald-950 px-4 py-4 text-center shadow-xl">
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

      
      {/* Horaires des prières du jour — compact */}
      <section
        aria-labelledby="prayer-times-heading"
        className="mt-2 shrink-0"
      >
        <h2
          id="prayer-times-heading"
          className="mb-1 text-center text-sm font-bold uppercase tracking-wider text-emerald-300"
        >
          Horaires des prières du jour
        </h2>

        <div className="grid grid-cols-5 gap-2">
          {prayers.map((prayer) => {
            const time = getPrayerTime(prayerTime, prayer.key);

            const iqamaKey = `${prayer.key}_iqama` as
              | "fajr_iqama"
              | "dhuhr_iqama"
              | "asr_iqama"
              | "maghrib_iqama"
              | "isha_iqama";

            const iqama = prayerTime?.[iqamaKey]?.slice(0, 5) ?? "--:--";
            const isNext = nextPrayer?.label === prayer.label;

            return (
              <article
                key={prayer.key}
                className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center ${
                  isNext
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-white/10 bg-white/3"
                }`}
              >
                <p className="text-xs font-bold text-gray-200 sm:text-sm">
                  {prayer.label}
                </p>

                <p
                  lang="ar"
                  dir="rtl"
                  className="text-xs text-emerald-300"
                >
                  {prayer.arabic}
                </p>

                <p className="mt-1 text-[10px] text-gray-500">
                  ADHAN
                </p>
                <p
                  className={`text-lg font-extrabold leading-tight tabular-nums sm:text-xl ${
                    isNext ? "text-amber-300" : "text-white"
                  }`}
                >
                  {time}
                </p>

                <div className="my-1 h-px w-3/4 bg-white/10" />

                <p className="text-[10px] text-gray-500">
                  IQAMA
                </p>
                <p className="text-sm font-bold leading-tight tabular-nums text-emerald-300 sm:text-base">
                  {iqama}
                </p>

                {isNext && (
                  <span className="mt-0.5 text-[9px] font-bold uppercase text-amber-300">
                    Prochaine
                  </span>
                )}
              </article>
            );
          })}
        </div>

        {prayersError && (
          <p className="mt-1 text-center text-xs text-red-400">
            Impossible de récupérer les horaires des prières.
          </p>
        )}
      </section>


      {/* Annonces */}
      <section
        aria-labelledby="announcements-heading"
        className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="mb-1 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="announcements-heading"
              className="text-[clamp(1.1rem,1.8vw,2rem)] font-bold"
            >
              Informations de la communauté
            </h2>
          </div>

          {slides.length > 0 && (
            <p
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm tabular-nums text-gray-300"
              aria-label={`Diapositive ${slideIndex + 1} sur ${slides.length}`}
            >
              {safeSlideIndex + 1} / {slides.length}
            </p>
          )}
        </div>


        <div
          aria-live="polite"
          aria-atomic="true"
          className={`relative flex min-h-0 flex-1 flex-col justify-center overflow-hidden rounded-2xl border p-[clamp(0.4rem,0.8vw,1rem)] ${
            isUrgent
              ? "border-red-500/40 bg-linear-to-br from-red-950 via-red-950 to-[#210b0b]"
              : "border-emerald-500/20 bg-linear-to-br from-[#10271f] to-[#0b1914]"
          }`}
        >
          {isUrgent && (
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1.5 bg-red-500"
            />
          )}

          {currentSlide?.type === "announcement" ? (
            <article
              key={`announcement-${currentSlide.data.id}`}
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

              <h3 className="wrap-break-word text-[clamp(1.1rem,2.2vw,2.8rem)] font-bold leading-tight tracking-tight">
                {currentSlide.data.title}
              </h3>

              <p className="mt-2 whitespace-pre-line wrap-break-word text-[clamp(0.9rem,1.35vw,1.65rem)] leading-snug text-gray-200">
                {currentSlide.data.body}
              </p>
            </article>
          ) : currentSlide?.type === "verse" ? (
            <article
              key={`verse-${currentSlide.reference}`}
              className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center text-center animate-in fade-in duration-500"
            >
              <p
                dir="rtl"
                lang="ar"
                className="text-[clamp(1.4rem,2.8vw,3.5rem)] leading-snug text-emerald-300"
              >
                {currentSlide.arabic}
              </p>

              <p className="mt-3 max-w-6xl text-[clamp(0.9rem,1.3vw,1.6rem)] leading-snug text-gray-200">
                {currentSlide.translation}
              </p>

              <p className="mt-2 text-[clamp(0.75rem,0.9vw,1rem)] text-gray-500">
                {currentSlide.reference}
              </p>
            </article>
          ) : currentSlide?.type === "event" ? (
            <article
              key={`event-${currentSlide.title}`}
              className="mx-auto w-full max-w-7xl animate-in fade-in duration-500"
            >
              <span className="mb-2 inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold sm:text-sm">
                ÉVÉNEMENT
              </span>

              <h3 className="wrap-break-word text-[clamp(1.1rem,2.2vw,2.5rem)] font-bold leading-tight">
                {currentSlide.title}
              </h3>

              <p className="mt-2 text-[clamp(0.85rem,1.2vw,1.5rem)] text-emerald-300">
                {new Date(currentSlide.starts_at).toLocaleString("fr-FR")}
              </p>

              {currentSlide.location && (
                <p className="mt-1 text-[clamp(0.8rem,1vw,1.2rem)] text-gray-400">
                  {currentSlide.location}
                </p>
              )}

              <p className="mt-2 whitespace-pre-line text-[clamp(0.85rem,1.2vw,1.5rem)] leading-snug text-gray-200">
                {currentSlide.description}
              </p>
            </article>
          ) : announcementsError ? (
            <div className="py-4 text-center">
              <h3 className="text-[clamp(1rem,1.5vw,1.5rem)] font-semibold text-gray-200">
                Annonces temporairement indisponibles
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Une nouvelle tentative sera effectuée automatiquement.
              </p>
            </div>
          ) : !announcementsLoaded && !versesLoaded && !eventsLoaded ? (
            <div className="py-4 text-center">
              <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-gray-300">
                Chargement des informations...
              </p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-[clamp(1.2rem,2vw,2rem)] font-semibold text-gray-200">
                Aucune information pour le moment
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Les annonces, versets et événements apparaîtront ici.
              </p>
            </div>
          )}

          {slides.length > 1 && (
            <div
              className="mt-[clamp(0.5rem,1vh,1rem)] flex shrink-0 items-center justify-center gap-2"
              aria-hidden="true"
            >
              {slides.slice(0, 12).map((slide, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === safeSlideIndex
                      ? "w-8 bg-emerald-400"
                      : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Pied d'écran : toujours visible en bas */}
      <footer className="relative z-10 mt-1 flex h-10 min-h-10 shrink-0 flex-row items-center justify-between gap-2 border-t border-white/10 bg-[#07110e] px-1 text-[clamp(0.65rem,0.8vw,0.8rem)] text-gray-400">
        <p>Foi · Paix · Fraternité</p>
        <p className="text-right">Qu’Allah bénisse notre communauté.</p>
      </footer>
    </main>
  );
}
