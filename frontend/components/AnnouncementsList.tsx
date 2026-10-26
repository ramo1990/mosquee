
import Link from "next/link";

import { apiGet } from "@/lib/api";
import type { Announcement } from "@/lib/types";

function AnnouncementSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement des annonces"
      className="grid gap-4 md:grid-cols-2"
    >
      <span className="sr-only">Chargement des annonces...</span>

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-gray-200 p-5"
        >
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full rounded bg-gray-100" />
          <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function AnnouncementsError() {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
    >
      <h3 className="font-semibold text-amber-950">
        Annonces temporairement indisponibles
      </h3>
      <p className="mt-2 text-sm text-amber-800">
        Impossible de charger les annonces. Veuillez réessayer plus tard.
      </p>
    </div>
  );
}

function EmptyAnnouncements() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm"
      >
        📢
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        Aucune annonce pour le moment
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Les prochaines informations de la communauté apparaîtront ici.
      </p>
    </div>
  );
}

export default async function AnnouncementsList() {
  let announcements: Announcement[];

  try {
    announcements = await apiGet<Announcement[]>("/annonces/public/");
  } catch (error) {
    console.error("Erreur lors du chargement des annonces :", error);
    return <AnnouncementsError />;
  }

  if (announcements.length === 0) {
    return <EmptyAnnouncements />;
  }

  const visibleAnnouncements = announcements.slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {visibleAnnouncements.map((announcement) => {
          const isUrgent = announcement.priority === "high";

          return (
            <article
              key={announcement.id}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isUrgent
                  ? "border-red-200 bg-red-50/70 hover:border-red-300"
                  : "border-gray-200 bg-white hover:border-emerald-200"
              }`}
            >
              {isUrgent && (
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-red-500"
                />
              )}

              <div className="flex flex-wrap items-center gap-2">
                {isUrgent ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-red-600"
                    />
                    Urgent
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Information
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-emerald-800 sm:text-lg">
                {announcement.title}
              </h3>

              <p className="mt-2 whitespace-pre-line wrap-break-word text-sm leading-6 text-gray-600">
                {announcement.body}
              </p>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-gray-100 pt-4">
        <Link
          href="/annonces"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Consulter toutes les annonces
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export { AnnouncementSkeleton };
