
"use client";

import {
  Task,
  TaskStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from "./types";

type TasksTableProps = {
  tasks: Task[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (task: Task) => void;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
};

export default function TasksTable({
  tasks,
  loading,
  updatingId,
  onEdit,
  onChangeStatus,
}: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des tâches
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {tasks.length} tâche(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune tâche trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle tâche ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Tâche</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Échéance</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => {
                const isUpdating = updatingId === task.id;

                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {task.title}
                      </div>

                      {task.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {task.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {task.assigned_to_name || "Non assignée"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${PRIORITY_COLORS[task.priority]}`}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {task.due_date || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[task.status]}`}
                      >
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        {task.status !== "done" && (
                          <button
                            type="button"
                            onClick={() => onChangeStatus(task, "done")}
                            disabled={isUpdating}
                            className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                          >
                            {isUpdating ? "Modification..." : "Terminer"}
                          </button>
                        )}

                        {task.status !== "in_progress" &&
                          task.status !== "done" && (
                            <button
                              type="button"
                              onClick={() =>
                                onChangeStatus(task, "in_progress")
                              }
                              disabled={isUpdating}
                              className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                            >
                              Démarrer
                            </button>
                          )}
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