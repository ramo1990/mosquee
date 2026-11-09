"use client";

import { LearningProgram } from "./types";

type Props = {
  programs: LearningProgram[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (program: LearningProgram) => void;
  onToggleStatus: (program: LearningProgram) => void;
};

export default function LearningProgramsTable({
  programs,
  loading,
  updatingId,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des programmes
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {programs.length} programme(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des programmes...
        </div>
      ) : programs.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun programme trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez un nouveau programme ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4">Niveau</th>
                <th className="px-6 py-4">Durée</th>
                <th className="px-6 py-4">Objectifs</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {programs.map((program) => {
                const isUpdating = updatingId === program.id;

                return (
                  <tr
                    key={program.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {program.title}
                      </div>

                      {program.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {program.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {program.level || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {program.duration_weeks
                        ? `${program.duration_weeks} semaine(s)`
                        : "—"}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-gray-600">
                      <p className="line-clamp-2">
                        {program.objectives || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          program.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {program.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(program)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(program)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            program.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : program.is_active
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