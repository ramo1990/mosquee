
import {
  CalendarEvent,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
} from "./types";

type Props = {
  events: CalendarEvent[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
};

export default function CourseCalendarTable({
  events,
  loading,
  updatingId,
  onEdit,
  onDelete,
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
            Créez une séance ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Événement</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Enseignant</th>
                <th className="px-6 py-4">Début</th>
                <th className="px-6 py-4">Fin</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const isUpdating = updatingId === event.id;

                return (
                  <tr key={event.id} className="hover:bg-gray-50">
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
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${EVENT_TYPE_COLORS[event.event_type]}`}
                      >
                        {EVENT_TYPE_LABELS[event.event_type]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {event.classroom_name || "Non affectée"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {event.teacher_name || "Non attribué"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(event.start_datetime).toLocaleString("fr-FR")}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(event.end_datetime).toLocaleString("fr-FR")}
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
                          onClick={() => onDelete(event)}
                          disabled={isUpdating}
                          className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                        >
                          {isUpdating ? "Suppression..." : "Supprimer"}
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