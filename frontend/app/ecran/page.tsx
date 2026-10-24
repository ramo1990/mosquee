// src/app/ecran/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { Announcement, PrayerTime } from "@/lib/types";

export default function MosqueScreenPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prayerTime, setPrayerTime] = useState<PrayerTime | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [announcementsData, prayerData] = await Promise.all([
          apiGet<Announcement[]>("/annonces/screen/"),
          apiGet<PrayerTime>("/horaires-prieres/today/"),
        ]);

        setAnnouncements(announcementsData);
        setPrayerTime(
          "fajr" in prayerData ? (prayerData as PrayerTime) : null
        );
      } catch {
        // L’écran réessaiera lors du prochain intervalle.
      }
    };

    loadData();

    const dataInterval = setInterval(loadData, 60_000);
    const clockInterval = setInterval(() => setNow(new Date()), 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % announcements.length);
    }, 15_000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const currentAnnouncement = announcements[currentIndex];

  return (
    <main className="flex h-screen w-screen flex-col bg-black p-10 text-white">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-emerald-400">
          Mosquée
        </h1>
        <p className="text-5xl font-bold tabular-nums">
          {now.toLocaleTimeString("fr-FR")}
        </p>
      </header>

      {prayerTime && (
        <section className="mt-8 grid grid-cols-5 gap-4">
          {[
            ["Fajr", prayerTime.fajr],
            ["Dhuhr", prayerTime.dhuhr],
            ["Asr", prayerTime.asr],
            ["Maghrib", prayerTime.maghrib],
            ["Isha", prayerTime.isha],
          ].map(([label, time]) => (
            <div
              key={label}
              className="rounded-2xl bg-neutral-900 p-6 text-center"
            >
              <p className="text-xl text-gray-400">{label}</p>
              <p className="mt-2 text-4xl font-bold">{time}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mt-10 flex-1">
        {currentAnnouncement ? (
          <article
            className={`h-full rounded-3xl p-10 ${
              currentAnnouncement.priority === "high"
                ? "bg-red-900"
                : "bg-neutral-900"
            }`}
          >
            {currentAnnouncement.priority === "high" && (
              <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-bold">
                URGENT
              </span>
            )}

            <h2 className="mt-4 text-6xl font-bold">
              {currentAnnouncement.title}
            </h2>
            <p className="mt-6 text-4xl leading-relaxed text-gray-200">
              {currentAnnouncement.body}
            </p>
          </article>
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl bg-neutral-900">
            <p className="text-4xl text-gray-500">
              Aucune annonce pour le moment
            </p>
          </div>
        )}
      </section>
    </main>
  );
}