import { apiGetList } from "@/lib/api";
import type { Announcement } from "@/lib/types";


async function getMosqueAnnouncements(
  mosqueSlug: string
): Promise<Announcement[]> {
  try {
    return await apiGetList<Announcement>(
      `/annonces/mosquee/${mosqueSlug}/`
    );
  } catch {
    return [];
  }
}


export default async function MosqueAnnouncements({
  mosqueSlug,
}: {
  mosqueSlug: string;
}) {
  const announcements = await getMosqueAnnouncements(mosqueSlug);

  if (announcements.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucune annonce active pour cette mosquée.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className={`overflow-hidden rounded-2xl border shadow-sm ${
            announcement.priority === "high"
              ? "border-red-200 bg-red-50"
              : "border-gray-200 bg-white"
          }`}
        >
          {announcement.image && (
            <img
              src={announcement.image}
              alt={announcement.title}
              className="h-48 w-full object-cover"
            />
          )}

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-gray-950">
                {announcement.title}
              </h3>

              {announcement.priority === "high" && (
                <span className="shrink-0 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  Urgente
                </span>
              )}
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
              {announcement.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}