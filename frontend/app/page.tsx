// src/app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import AnnouncementsList from "@/components/AnnouncementsList";
import PrayerTimesToday from "@/components/PrayerTimesToday";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-emerald-700 p-8 text-white">
        <h1 className="text-4xl font-bold">Bienvenue à la mosquée</h1>
        <p className="mt-3 max-w-2xl text-emerald-100">
          Retrouvez les annonces, les horaires de prière et les événements de
          la communauté.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/horaires"
            className="rounded-full bg-white px-5 py-2 font-semibold text-emerald-700"
          >
            Voir les horaires
          </Link>
          <Link
            href="/annonces"
            className="rounded-full border border-white px-5 py-2 font-semibold"
          >
            Voir les annonces
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Horaires du jour</h2>
        <Suspense
          fallback={
            <p className="text-gray-500">Chargement des horaires...</p>
          }
        >
          <PrayerTimesToday />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Dernières annonces</h2>
        <Suspense
          fallback={
            <p className="text-gray-500">Chargement des annonces...</p>
          }
        >
          <AnnouncementsList />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Événements à venir</h2>
        <Suspense
          fallback={
            <p className="text-gray-500">Chargement des événements...</p>
          }
        >
          <UpcomingEvents />
        </Suspense>
      </section>
    </div>
  );
}