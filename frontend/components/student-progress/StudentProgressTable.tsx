
import { StudentProgress } from "./types";

type Props = {
  records: StudentProgress[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (record: StudentProgress) => void;
  onDelete: (record: StudentProgress) => void;
};

export default function StudentProgressTable({
  records,
  loading,
  updatingId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Suivi des élèves
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {records.length} évaluation(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune évaluation trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez une évaluation ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Moyenne</th>
                <th className="px-6 py-4">Appréciation</th>
                <th className="px-6 py-4">Points forts</th>
                <th className="px-6 py-4">Difficultés</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {records.map((record) => {
                const isUpdating = updatingId === record.id;

                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {record.student_name ||
                        `Élève #${record.student}`}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {record.classroom_name || "Non affecté"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {record.average_score ?? "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {record.appreciation || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {record.strengths || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {record.difficulties || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(record)}
                          disabled={isUpdating || record.is_active === false}
                          className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Désactivation..."
                            : record.is_active === false
                              ? "Désactivée"
                              : "Désactiver"}
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