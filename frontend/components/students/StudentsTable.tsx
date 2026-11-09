import { Student } from "./types";

type Props = {
  students: Student[];
  loading: boolean;
  updatingId: number | null;
  onToggleStatus: (student: Student) => void;
};

export default function StudentsTable({
  students,
  loading,
  updatingId,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des élèves
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {students.length} élève(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des élèves...
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun élève trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Inscrivez un nouvel élève ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const isUpdating = updatingId === student.id;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {student.email || student.username || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {student.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {student.classroom_name || "Non affecté"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          student.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(student)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            student.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : student.is_active
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