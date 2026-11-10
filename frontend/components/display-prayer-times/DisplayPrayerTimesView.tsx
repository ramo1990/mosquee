
"use client";

import { DisplayPrayerTime } from "./types";

type Props = {
  prayerTimes: DisplayPrayerTime[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (item: DisplayPrayerTime) => void;
  onTogglePublication: (item: DisplayPrayerTime) => void;
};

export default function DisplayPrayerTimesView({
  prayerTimes,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      {/* En-tête */}
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Horaires affichés
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {prayerTimes.length} journée(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : prayerTimes.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun horaire trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez les horaires du jour ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Fajr</th>
                <th className="px-6 py-4">Dhuhr</th>
                <th className="px-6 py-4">Asr</th>
                <th className="px-6 py-4">Maghrib</th>
                <th className="px-6 py-4">Isha</th>
                <th className="px-6 py-4">Jumua</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {prayerTimes.map((item) => {
                const isUpdating = updatingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.date}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.screen_group || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.fajr || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.dhuhr || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.asr || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.maghrib || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.isha || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.jumua_time || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.is_published
                          ? "Publié"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(item)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            item.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : item.is_published
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