
"use client";

import {
  EVENT_TYPE_LABELS,
  type IslamicCalendarEvent,
} from "./types";

type Props = {
  events: IslamicCalendarEvent[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (event: IslamicCalendarEvent) => void;
  onToggleStatus: (event: IslamicCalendarEvent) => void;
};

export default function IslamicCalendarTable({
  events,
  loading,
  updatingId,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Événements religieux
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {events.length} événement(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun événement trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez un événement ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Événement</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date hégirienne</th>
                <th className="px-6 py-4">Date grégorienne</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const isUpdating = updatingId === event.id;

                return (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {event.title}
                      </div>

                      {event.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {event.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {EVENT_TYPE_LABELS[event.event_type]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {event.hijri_date || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {event.gregorian_date || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          event.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(event)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(event)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            event.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : event.is_active
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