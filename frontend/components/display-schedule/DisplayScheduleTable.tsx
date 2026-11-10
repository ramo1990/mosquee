
"use client";

import type { DisplaySchedule } from "./types";

type Props = {
  schedules: DisplaySchedule[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (schedule: DisplaySchedule) => void;
  onToggleStatus: (schedule: DisplaySchedule) => void;
};

export default function DisplayScheduleTable({
  schedules,
  loading,
  updatingId,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des programmations
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {schedules.length} programmation(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune programmation trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle programmation ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Programmation</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Début</th>
                <th className="px-6 py-4">Fin</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {schedules.map((schedule) => {
                const isUpdating = updatingId === schedule.id;

                return (
                  <tr
                    key={schedule.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {schedule.title}
                      </div>

                      {schedule.content && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {schedule.content}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {schedule.screen_group || "—"}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {schedule.priority}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        schedule.start_datetime
                      ).toLocaleString("fr-FR")}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        schedule.end_datetime
                      ).toLocaleString("fr-FR")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          schedule.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {schedule.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(schedule)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(schedule)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            schedule.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : schedule.is_active
                              ? "Désactiver"
                              : "Activer"}
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