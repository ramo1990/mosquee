
"use client";

import type { RamadanDay } from "./types";

type Props = {
  days: RamadanDay[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (day: RamadanDay) => void;
  onTogglePublication: (day: RamadanDay) => void;
};

export default function RamadanTable({
  days,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Programme du mois de Ramadan
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {days.length} journée(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : days.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune journée trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez les journées de Ramadan ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Jour</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Fin Suhoor</th>
                <th className="px-6 py-4">Iftar</th>
                <th className="px-6 py-4">Tarawih</th>
                <th className="px-6 py-4">Activité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {days.map((day) => {
                const isUpdating = updatingId === day.id;

                return (
                  <tr key={day.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 font-bold text-gray-900">
                      Jour {day.day_number}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {day.date}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {day.suhoor_end_time || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {day.iftar_time || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {day.tarawih_time || "—"}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-gray-600">
                      {day.activity || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          day.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {day.is_published
                          ? "Publiée"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(day)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(day)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            day.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : day.is_published
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