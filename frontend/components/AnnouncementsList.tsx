// src/components/AnnouncementsList.tsx
import { apiGet } from "@/lib/api";
import type { Announcement } from "@/lib/types";

export default async function AnnouncementsList() {
  const announcements = await apiGet<Announcement[]>("/annonces/public/");

  if (announcements.length === 0) {
    return <p className="text-gray-500">Aucune annonce pour le moment.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {announcements.slice(0, 4).map((announcement) => (
        <article
          key={announcement.id}
          className={`rounded-2xl border p-5 shadow-sm ${
            announcement.priority === "high"
              ? "border-red-300 bg-red-50"
              : "bg-white"
          }`}
        >
          {announcement.priority === "high" && (
            <span className="mb-2 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              Urgent
            </span>
          )}

          <h3 className="text-lg font-semibold">{announcement.title}</h3>
          <p className="mt-2 text-gray-600">{announcement.body}</p>
        </article>
      ))}
    </div>
  );
}