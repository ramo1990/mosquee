
import {
  Student,
  AttendanceState,
  AttendanceStatus,
  STATUS_OPTIONS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "./types";

type Props = {
  students: Student[];
  attendance: AttendanceState;
  selectedDate: string;
  loading: boolean;
  onUpdate: (
    studentId: number,
    field: "status" | "note",
    value: string
  ) => void;
};

export default function AttendanceTable({
  students,
  attendance,
  selectedDate,
  loading,
  onUpdate,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Feuille de présence
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {students.length} élève(s) — {selectedDate}
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun élève trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Sélectionnez une classe ou inscrivez des élèves.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Commentaire</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const entry = attendance[student.id];

                if (!entry) return null;

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {student.classroom_name || "Non affecté"}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={entry.status}
                        onChange={(event) =>
                          onUpdate(
                            student.id,
                            "status",
                            event.target.value
                          )
                        }
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold outline-none focus:border-emerald-600 ${
                          STATUS_COLORS[entry.status]
                        }`}
                      >
                        {STATUS_OPTIONS.map((status: AttendanceStatus) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={entry.note}
                        onChange={(event) =>
                          onUpdate(
                            student.id,
                            "note",
                            event.target.value
                          )
                        }
                        placeholder="Commentaire facultatif"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-emerald-600"
                      />
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