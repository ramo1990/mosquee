
"use client";

import type {
  ReligiousEvent,
  EventStatus,
} from "./types";

import {
  TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  events: ReligiousEvent[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (event: ReligiousEvent) => void;
  onTogglePublication: (event: ReligiousEvent) => void;
  onChangeStatus: (
    event: ReligiousEvent,
    status: EventStatus
  ) => void;
};

export default function ReligiousEventsTable({
  events,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
  onChangeStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des événements
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
            Créez un nouvel événement ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Événement</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Publication</th>
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

                    {/* Événement */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {event.title}
                      </div>

                      {event.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {event.description}
                        </div>
                      )}

                      {event.start_time && (
                        <div className="mt-1 text-xs text-gray-400">
                          {event.start_time}
                          {event.end_time
                            ? ` - ${event.end_time}`
                            : ""}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {TYPE_LABELS[event.event_type]}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 text-gray-600">
                      <div>{event.start_date}</div>

                      {event.end_date &&
                        event.end_date !== event.start_date && (
                          <div className="mt-1 text-xs text-gray-400">
                            Au {event.end_date}
                          </div>
                        )}
                    </td>

                    {/* Lieu */}
                    <td className="px-6 py-4 text-gray-600">
                      {event.location || "—"}
                    </td>

                    {/* Participants */}
                    <td className="px-6 py-4 text-gray-600">
                      {event.participant_count ?? 0}

                      {event.max_participants != null && (
                        <span>
                          {" / "}
                          {event.max_participants}
                        </span>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      <select
                        value={event.status}
                        onChange={(e) =>
                          onChangeStatus(
                            event,
                            e.target.value as EventStatus
                          )
                        }
                        disabled={isUpdating}
                        className={`rounded-full border-0 px-3 py-2 text-xs font-bold outline-none disabled:opacity-50 ${STATUS_COLORS[event.status]}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Publication */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          event.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.is_published
                          ? "Publié"
                          : "Brouillon"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">

                        <button
                          type="button"
                          onClick={() => onEdit(event)}
                          disabled={isUpdating}
                          className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(event)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            event.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : event.is_published
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