
import { Classroom } from "./classroom.types";

type Props = {
  classrooms: Classroom[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (classroom: Classroom) => void;
  onToggleStatus: (classroom: Classroom) => void;
};

export default function ClassroomTable({
  classrooms,
  loading,
  updatingId,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des classes
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {classrooms.length} classe(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des classes...
        </div>
      ) : classrooms.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune classe trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle classe ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Niveau</th>
                <th className="px-6 py-4">Élèves</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {classrooms.map((classroom) => {
                const isUpdating = updatingId === classroom.id;

                return (
                  <tr key={classroom.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {classroom.name}
                      </div>

                      {classroom.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {classroom.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {classroom.level || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {classroom.student_count ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          classroom.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {classroom.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(classroom)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(classroom)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            classroom.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : classroom.is_active
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
