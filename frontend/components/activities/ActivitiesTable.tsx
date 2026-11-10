
"use client";

import {
  Activity,
  ActivityStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  TYPE_LABELS,
} from "./types";

type ActivitiesTableProps = {
  activities: Activity[];
  updatingId: number | null;

  onEdit: (activity: Activity) => void;
  onTogglePublication: (activity: Activity) => void;
  onChangeStatus: (
    activity: Activity,
    status: ActivityStatus
  ) => void;
};

export default function ActivitiesTable({
  activities,
  updatingId,
  onEdit,
  onTogglePublication,
  onChangeStatus,
}: ActivitiesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-275 text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4">Activité</th>
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
          {activities.map((activity) => {
            const isUpdating = updatingId === activity.id;

            return (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {activity.title}
                  </div>

                  {activity.description && (
                    <div className="mt-1 max-w-md text-xs text-gray-500">
                      {activity.description}
                    </div>
                  )}

                  {activity.organizer && (
                    <div className="mt-1 text-xs text-gray-400">
                      Organisateur : {activity.organizer}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {TYPE_LABELS[activity.activity_type]}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  <div>{activity.start_date}</div>

                  {activity.end_date &&
                    activity.end_date !== activity.start_date && (
                      <div className="text-xs text-gray-400">
                        Jusqu&apos;au {activity.end_date}
                      </div>
                    )}

                  {(activity.start_time || activity.end_time) && (
                    <div className="mt-1 text-xs text-gray-500">
                      {activity.start_time || "--:--"}
                      {" - "}
                      {activity.end_time || "--:--"}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {activity.location || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {activity.participant_count ?? 0}
                  {activity.max_participants
                    ? ` / ${activity.max_participants}`
                    : ""}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[activity.status]}`}
                  >
                    {STATUS_LABELS[activity.status]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      activity.is_published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activity.is_published ? "Publiée" : "Brouillon"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(activity)}
                      disabled={isUpdating}
                      className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePublication(activity)}
                      disabled={isUpdating}
                      className={`font-semibold hover:underline disabled:opacity-50 ${
                        activity.is_published
                          ? "text-red-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {isUpdating
                        ? "Modification..."
                        : activity.is_published
                          ? "Dépublier"
                          : "Publier"}
                    </button>
                  </div>

                  {activity.status !== "completed" &&
                    activity.status !== "cancelled" && (
                      <div className="mt-3 flex justify-end">
                        <select
                          aria-label={`Changer le statut de ${activity.title}`}
                          value={activity.status}
                          disabled={isUpdating}
                          onChange={(event) =>
                            onChangeStatus(
                              activity,
                              event.target.value as ActivityStatus
                            )
                          }
                          className="max-w-37.5 rounded-lg border border-gray-200 px-2 py-1 text-xs disabled:opacity-50"
                        >
                          {(["planned", "ongoing", "completed", "cancelled"] as ActivityStatus[]).map(
                            (status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}