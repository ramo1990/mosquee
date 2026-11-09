"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost } from "@/lib/api";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  classroom?: number | null;
  classroom_name?: string;
};

type Classroom = {
  id: number;
  name: string;
};

type AttendanceRecord = {
  student: number;
  status: AttendanceStatus;
  note?: string;
};

type AttendanceEntry = {
  studentId: number;
  studentName: string;
  status: AttendanceStatus;
  note: string;
};

const STATUS_OPTIONS: AttendanceStatus[] = [
  "present",
  "absent",
  "late",
  "excused",
];

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Présent",
  absent: "Absent",
  late: "Retard",
  excused: "Absence justifiée",
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-800",
  excused: "bg-blue-100 text-blue-800",
};

export default function AttendanceManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedClassroom, setSelectedClassroom] = useState("all");

  const [attendance, setAttendance] = useState<
    Record<number, AttendanceEntry>
  >({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAttendanceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData] = await Promise.all([
        apiGetList<Student[]>("/students/"),
        apiGetList<Classroom[]>("/classrooms/"),
      ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);

      const initialAttendance: Record<number, AttendanceEntry> = {};

      studentsData.forEach((student) => {
        initialAttendance[student.id] = {
          studentId: student.id,
          studentName: `${student.first_name} ${student.last_name}`,
          status: "present",
          note: "",
        };
      });

      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Erreur chargement des présences :", err);
      setStudents([]);
      setClassrooms([]);
      setError("Impossible de charger les élèves pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [studentsData, classroomsData] = await Promise.all([
          apiGetList<Student[]>("/students/"),
          apiGetList<Classroom[]>("/classrooms/"),
        ]);

        if (!ignore) {
          setStudents(studentsData);
          setClassrooms(classroomsData);

          const initialAttendance: Record<number, AttendanceEntry> = {};

          studentsData.forEach((student) => {
            initialAttendance[student.id] = {
              studentId: student.id,
              studentName: `${student.first_name} ${student.last_name}`,
              status: "present",
              note: "",
            };
          });

          setAttendance(initialAttendance);
        }
      } catch (err) {
        console.error("Erreur chargement des présences :", err);

        if (!ignore) {
          setStudents([]);
          setClassrooms([]);
          setError("Impossible de charger les élèves pour le moment.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        selectedClassroom === "all" ||
        String(student.classroom) === selectedClassroom
      );
    });
  }, [students, selectedClassroom]);

  const statusCounts = useMemo(() => {
    return filteredStudents.reduce(
      (counts, student) => {
        const entry = attendance[student.id];

        if (entry) {
          counts[entry.status] += 1;
        }

        return counts;
      },
      {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
      } as Record<AttendanceStatus, number>
    );
  }, [filteredStudents, attendance]);

  function updateAttendance(
    studentId: number,
    field: "status" | "note",
    value: string
  ) {
    setAttendance((current) => ({
      ...current,
      [studentId]: {
        ...current[studentId],
        [field]: value,
      },
    }));
  }

  function setAllStatus(status: AttendanceStatus) {
    setAttendance((current) => {
      const nextAttendance = { ...current };

      filteredStudents.forEach((student) => {
        nextAttendance[student.id] = {
          ...nextAttendance[student.id],
          status,
        };
      });

      return nextAttendance;
    });
  }

  async function saveAttendance() {
    setError("");
    setSuccess("");

    if (filteredStudents.length === 0) {
      setError("Sélectionnez une classe contenant des élèves.");
      return;
    }

    setSaving(true);

    const records: AttendanceRecord[] = filteredStudents.map((student) => ({
      student: student.id,
      status: attendance[student.id].status,
      note: attendance[student.id].note.trim() || undefined,
    }));

    try {
      await apiPost("/attendance/bulk-create/", {
        date: selectedDate,
        classroom: selectedClassroom === "all" ? null : Number(selectedClassroom),
        records,
      });

      setSuccess("Présences enregistrées avec succès.");
    } catch (err) {
      console.error("Erreur enregistrement des présences :", err);
      setError("Impossible d'enregistrer les présences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des présences
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enregistrez les présences, absences et retards des élèves.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAttendanceData}
          disabled={loading}
          className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Présents" value={statusCounts.present} />
        <StatCard title="Absents" value={statusCounts.absent} />
        <StatCard title="Retards" value={statusCounts.late} />
        <StatCard title="Justifiées" value={statusCounts.excused} />
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[200px_1fr]">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Classe
          </label>

          <select
            value={selectedClassroom}
            onChange={(event) => setSelectedClassroom(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="all">Toutes les classes</option>

            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAllStatus("present")}
            className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-200"
          >
            Tout présent
          </button>

          <button
            type="button"
            onClick={() => setAllStatus("absent")}
            className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
          >
            Tout absent
          </button>

          <button
            type="button"
            onClick={() => setAllStatus("late")}
            className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-200"
          >
            Tout en retard
          </button>
        </div>

        <button
          type="button"
          onClick={saveAttendance}
          disabled={saving || loading}
          className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer les présences"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Feuille de présence</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredStudents.length} élève(s) — {selectedDate}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredStudents.length === 0 ? (
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
                {filteredStudents.map((student) => {
                  const entry = attendance[student.id];

                  if (!entry) {
                    return null;
                  }

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
                            updateAttendance(
                              student.id,
                              "status",
                              event.target.value
                            )
                          }
                          className={`rounded-xl border px-4 py-2 text-sm font-semibold outline-none focus:border-emerald-600 ${STATUS_COLORS[entry.status]}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
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
                            updateAttendance(
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
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">{value}</p>
    </div>
  );
}