// src/components/UpcomingEvents.tsx
import { apiGet } from "@/lib/api";
import type { Event } from "@/lib/types";

export default async function UpcomingEvents() {
  const events = await apiGet<Event[]>("/evenements/upcoming/");

  if (events.length === 0) {
    return <p className="text-gray-500">Aucun événement à venir.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.slice(0, 4).map((event) => (
        <article
          key={event.id}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(event.starts_at).toLocaleString("fr-FR")}
          </p>
          <p className="mt-2 text-gray-600">{event.description}</p>
        </article>
      ))}
    </div>
  );
}