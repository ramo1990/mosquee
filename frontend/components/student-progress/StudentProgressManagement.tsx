"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

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

type StudentProgress = {
  id: number;
  student: number;
  student_name?: string;
  classroom?: number | null;
  classroom_name?: string;
  average_score?: number | null;
  appreciation?: string;
  strengths?: string;
  difficulties?: string;
  comments?: string;
  is_active?: boolean;
};

type ProgressForm = {
  student: string;
  average_score: string;
  appreciation: string;
  strengths: string;
  difficulties: string;
  comments: string;
};

const EMPTY_FORM: ProgressForm = {
  student: "",
  average_score: "",
  appreciation: "",
  strengths: "",
  difficulties: "",
  comments: "",
};

export default function StudentProgressManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [progressRecords, setProgressRecords] = useState<StudentProgress[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgressForm>(EMPTY_FORM);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData, progressData] = await Promise.all([
        apiGetList<Student[]>("/students/"),
        apiGetList<Classroom[]>("/classrooms/"),
        apiGetList<StudentProgress[]>("/student-progress/"),
      ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);
      setProgressRecords(progressData);
    } catch (err) {
      console.error("Erreur chargement du suivi des élèves :", err);
      setStudents([]);
      setClassrooms([]);
      setProgressRecords([]);
      setError("Impossible de charger le suivi des élèves pour le moment.");
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
        const [studentsData, classroomsData, progressData] = await Promise.all([
          apiGetList<Student[]>("/students/"),
          apiGetList<Classroom[]>("/classrooms/"),
          apiGetList<StudentProgress[]>("/student-progress/"),
        ]);

        if (!ignore) {
          setStudents(studentsData);
          setClassrooms(classroomsData);
          setProgressRecords(progressData);
        }
      } catch (err) {
        console.error("Erreur chargement du suivi des élèves :", err);

        if (!ignore) {
          setStudents([]);
          setClassrooms([]);
          setProgressRecords([]);
          setError("Impossible de charger le suivi des élèves pour le moment.");
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

  const filteredProgress = useMemo(() => {
    const query = search.toLowerCase().trim();

    return progressRecords.filter((record) => {
      const matchesSearch =
        !query ||
        [
          record.student_name,
          record.classroom_name,
          record.appreciation,
          record.strengths,
          record.difficulties,
          record.comments,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesClassroom =
        classroomFilter === "all" ||
        String(record.classroom) === classroomFilter;

      return matchesSearch && matchesClassroom;
    });
  }, [progressRecords, search, classroomFilter]);

  const averageScore = useMemo(() => {
    const scores = progressRecords
      .map((record) => record.average_score)
      .filter((score): score is number => typeof score === "number");

    if (scores.length === 0) {
      return 0;
    }

    return scores.reduce((total, score) => total + score, 0) / scores.length;
  }, [progressRecords]);

  const studentsWithProgress = progressRecords.length;
  const studentsWithoutProgress = Math.max(
    students.length - progressRecords.length,
    0
  );

  function updateForm(field: keyof ProgressForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(record: StudentProgress) {
    setForm({
      student: String(record.student),
      average_score:
        record.average_score === null || record.average_score === undefined
          ? ""
          : String(record.average_score),
      appreciation: record.appreciation ?? "",
      strengths: record.strengths ?? "",
      difficulties: record.difficulties ?? "",
      comments: record.comments ?? "",
    });

    setEditingId(record.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      student: Number(form.student),
      average_score: form.average_score ? Number(form.average_score) : null,
      appreciation: form.appreciation.trim() || undefined,
      strengths: form.strengths.trim() || undefined,
      difficulties: form.difficulties.trim() || undefined,
      comments: form.comments.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedRecord = await apiPatch<StudentProgress>(
          `/student-progress/${editingId}/`,
          payload
        );

        setProgressRecords((current) =>
          current.map((record) =>
            record.id === editingId
              ? { ...record, ...updatedRecord }
              : record
          )
        );

        setSuccess("Évaluation modifiée avec succès.");
      } else {
        const createdRecord = await apiPost<StudentProgress>(
          "/student-progress/",
          payload
        );

        setProgressRecords((current) => [createdRecord, ...current]);
        setSuccess("Évaluation enregistrée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du suivi :", err);
      setError(
        editingId
          ? "Impossible de modifier cette évaluation."
          : "Impossible d'enregistrer cette évaluation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProgress(record: StudentProgress) {
    setError("");
    setSuccess("");
    setUpdatingId(record.id);

    try {
      await apiPatch(`/student-progress/${record.id}/`, {
        is_active: false,
      });

      setProgressRecords((current) =>
        current.map((item) =>
          item.id === record.id
            ? { ...item, is_active: false }
            : item
        )
      );

      setSuccess("Évaluation désactivée avec succès.");
    } catch (err) {
      console.error("Erreur désactivation du suivi :", err);
      setError("Impossible de désactiver cette évaluation.");
    } finally {
      setUpdatingId(null);
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
            Suivi des élèves
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Suivez la progression, les résultats et les difficultés des élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle évaluation
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Élèves suivis" value={studentsWithProgress} />
        <StatCard title="Élèves sans suivi" value={studentsWithoutProgress} />
        <StatCard
          title="Moyenne générale"
          value={Number(averageScore.toFixed(2))}
        />
        <StatCard title="Classes" value={classrooms.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'évaluation"
              : "Ajouter une évaluation"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Élève <span className="text-red-500">*</span>
              </label>

              <select
                value={form.student}
                onChange={(event) =>
                  updateForm("student", event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Sélectionner un élève</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Moyenne / Note"
              type="number"
              value={form.average_score}
              onChange={(value) => updateForm("average_score", value)}
              placeholder="Exemple : 15.5"
            />

            <div className="md:col-span-2">
              <FormField
                label="Appréciation"
                value={form.appreciation}
                onChange={(value) => updateForm("appreciation", value)}
                placeholder="Exemple : Très bons progrès en récitation"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Points forts"
                value={form.strengths}
                onChange={(value) => updateForm("strengths", value)}
                placeholder="Exemple : Mémorisation, participation, assiduité"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Difficultés"
                value={form.difficulties}
                onChange={(value) => updateForm("difficulties", value)}
                placeholder="Exemple : Prononciation, révision, concentration"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Commentaires"
                value={form.comments}
                onChange={(value) => updateForm("comments", value)}
                placeholder="Observations générales"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setShowForm(false);
              }}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Enregistrer les modifications"
                  : "Enregistrer l'évaluation"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un élève, une appréciation ou une difficulté..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={classroomFilter}
          onChange={(event) => setClassroomFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les classes</option>

          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Suivi des élèves</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredProgress.length} évaluation(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredProgress.length === 0 ? (
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
                {filteredProgress.map((record) => {
                  const isUpdating = updatingId === record.id;

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {record.student_name || `Élève #${record.student}`}
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
                            onClick={() => openEditForm(record)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProgress(record)}
                            disabled={isUpdating}
                            className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            {isUpdating ? "Suppression..." : "Désactiver"}
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
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
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