
"use client";

import {
  ReligiousAnnouncement,
  TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "./types";

type Props = {
  announcements: ReligiousAnnouncement[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (announcement: ReligiousAnnouncement) => void;
  onTogglePublication: (announcement: ReligiousAnnouncement) => void;
};

export default function ReligiousAnnouncementsTable({
  announcements,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des annonces
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {announcements.length} annonce(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune annonce trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle annonce ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Annonce</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {announcements.map((announcement) => {
                const isUpdating =
                  updatingId === announcement.id;

                return (
                  <tr
                    key={announcement.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {announcement.title}
                      </div>

                      {announcement.content && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {announcement.content}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {TYPE_LABELS[announcement.announcement_type]}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          PRIORITY_COLORS[announcement.priority]
                        }`}
                      >
                        {PRIORITY_LABELS[announcement.priority]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {announcement.start_date || "—"}{" "}
                      {announcement.end_date
                        ? `→ ${announcement.end_date}`
                        : ""}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          announcement.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {announcement.is_published
                          ? "Publiée"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(announcement)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onTogglePublication(announcement)
                          }
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            announcement.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : announcement.is_published
                              ? "Dépublier"
                              : "Publier"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}