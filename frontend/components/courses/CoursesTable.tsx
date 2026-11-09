"use client";

import { Course } from "./types";

type Props = {
  courses: Course[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (course: Course) => void;
  onToggleStatus: (course: Course) => void;
};

export default function CoursesTable({
  courses,
  loading,
  updatingId,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des cours
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {courses.length} cours
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des cours...
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun cours trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez un nouveau cours ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Cours</th>
                <th className="px-6 py-4">Matière</th>
                <th className="px-6 py-4">Enseignant</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Horaires</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => {
                const isUpdating = updatingId === course.id;

                return (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {course.title}
                      </div>

                      {course.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {course.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.subject || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.teacher_name || "Non attribué"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.classroom_name || "Non affectée"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.schedule || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          course.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {course.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(course)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(course)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            course.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : course.is_active
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