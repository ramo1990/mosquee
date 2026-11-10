
"use client";

import {
  Assignment,
  TYPE_LABELS,
} from "./types";

type Props = {
  records: Assignment[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (assignment: Assignment) => void;
  onTogglePublication: (assignment: Assignment) => void;
};

export default function AssignmentsTable({
  records,
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
          Liste des devoirs et évaluations
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {records.length} élément(s)
        </p>
      </div>

      {/* Chargement */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun devoir trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez un nouveau devoir ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Devoir</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Enseignant</th>
                <th className="px-6 py-4">Date limite</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {records.map((assignment) => {
                const isUpdating =
                  updatingId === assignment.id;

                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {assignment.title}
                      </div>

                      {assignment.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {assignment.description}
                        </div>
                      )}

                      {assignment.max_score != null && (
                        <div className="mt-1 text-xs text-gray-400">
                          Note maximale : {assignment.max_score}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                        {TYPE_LABELS[assignment.assignment_type]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {assignment.classroom_name || "Non affectée"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {assignment.teacher_name || "Non attribué"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {assignment.due_date || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          assignment.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {assignment.is_published
                          ? "Publié"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">

                        <button
                          type="button"
                          onClick={() => onEdit(assignment)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onTogglePublication(assignment)
                          }
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            assignment.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : assignment.is_published
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