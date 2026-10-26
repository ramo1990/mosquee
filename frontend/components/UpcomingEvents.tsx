
import Link from "next/link";

import { apiGet } from "@/lib/api";
import type { Event } from "@/lib/types";

const TIME_ZONE = "Africa/Abidjan";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    day: new Intl.DateTimeFormat("fr-FR", {
      timeZone: TIME_ZONE,
      day: "2-digit",
    }).format(date),
    month: new Intl.DateTimeFormat("fr-FR", {
      timeZone: TIME_ZONE,
      month: "short",
    })
      .format(date)
      .replace(".", ""),
    fullDate: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
}

function EventsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement des événements"
      className="grid gap-4 md:grid-cols-2"
    >
      <span className="sr-only">Chargement des événements...</span>

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-gray-200 p-5"
        >
          <div className="flex gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
          <div className="mt-4 h-3 w-full rounded bg-gray-100" />
          <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function EventsError() {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
    >
      <h3 className="font-semibold text-amber-950">
        Événements temporairement indisponibles
      </h3>
      <p className="mt-2 text-sm leading-6 text-amber-800">
        Impossible de charger les prochains événements.
        Veuillez réessayer ultérieurement.
      </p>
    </div>
  );
}

function EmptyEvents() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm"
      >
        📅
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        Aucun événement à venir
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        Les prochains rendez-vous de la communauté seront affichés ici.
      </p>
    </div>
  );
}

export default async function UpcomingEvents() {
  let events: Event[];

  try {
    events = await apiGet<Event[]>("/evenements/upcoming/");
  } catch (error) {
    console.error("Erreur lors du chargement des événements :", error);
    return <EventsError />;
  }

  if (events.length === 0) {
    return <EmptyEvents />;
  }

  const visibleEvents = events.slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {visibleEvents.map((event) => {
          const date = formatEventDate(event.starts_at);

          return (
            <article
              key={event.id}
              className="group flex h-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5"
            >
              <div
                className="flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"
                aria-label={
                  date ? `Date : ${date.fullDate}` : "Date non disponible"
                }
              >
                {date ? (
                  <>
                    <span className="text-2xl font-bold leading-none tabular-nums">
                      {date.day}
                    </span>
                    <span className="mt-1 text-xs font-semibold uppercase">
                      {date.month}
                    </span>
                  </>
                ) : (
                  <span className="px-1 text-center text-xs font-medium">
                    Date à confirmer
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="wrap-break-word font-bold leading-snug text-gray-900 transition-colors group-hover:text-emerald-800">
                  {event.title}
                </h3>

                {date && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    <time dateTime={event.starts_at}>
                      {date.fullDate}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-emerald-800">
                      {date.time}
                    </span>
                  </div>
                )}

                <p className="mt-3 whitespace-pre-line wrap-break-word text-sm leading-6 text-gray-600">
                  {event.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-gray-100 pt-4">
        <Link
          href="/evenements"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Voir tous les événements
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export { EventsSkeleton };
