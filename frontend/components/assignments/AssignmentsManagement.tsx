"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type AssignmentType = "homework" | "quiz" | "exam" | "project";

type Assignment = {
  id: number;
  title: string;
  assignment_type: AssignmentType;
  description?: string;
  classroom?: number | null;
  classroom_name?: string;
  teacher?: number | null;
  teacher_name?: string;
  due_date?: string;
  max_score?: number | null;
  is_published: boolean;
};

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type Classroom = {
  id: number;
  name: string;
};

type AssignmentForm = {
  title: string;
  assignment_type: AssignmentType;
  description: string;
  classroom: string;
  teacher: string;
  due_date: string;
  max_score: string;
};

const EMPTY_FORM: AssignmentForm = {
  title: "",
  assignment_type: "homework",
  description: "",
  classroom: "",
  teacher: "",
  due_date: "",
  max_score: "",
};

const TYPE_LABELS: Record<AssignmentType, string> = {
  homework: "Devoir",
  quiz: "Quiz",
  exam: "Contrôle",
  project: "Projet",
};

const TYPE_OPTIONS: AssignmentType[] = [
  "homework",
  "quiz",
  "exam",
  "project",
];

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AssignmentType>("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AssignmentForm>(EMPTY_FORM);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [assignmentsData, teachersData, classroomsData] = await Promise.all([
        apiGetList<Assignment[]>("/assignments/"),
        apiGetList<Teacher[]>("/users/?role=teacher"),
        apiGetList<Classroom[]>("/classrooms/"),
      ]);

      setAssignments(assignmentsData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des devoirs et évaluations :", err);
      setAssignments([]);
      setTeachers([]);
      setClassrooms([]);
      setError(
        "Impossible de charger les devoirs et évaluations pour le moment."
      );
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
        const [assignmentsData, teachersData, classroomsData] = await Promise.all([
          apiGetList<Assignment[]>("/assignments/"),
          apiGetList<Teacher[]>("/users/?role=teacher"),
          apiGetList<Classroom[]>("/classrooms/"),
        ]);

        if (!ignore) {
          setAssignments(assignmentsData);
          setTeachers(teachersData);
          setClassrooms(classroomsData);
        }
      } catch (err) {
        console.error("Erreur chargement des devoirs et évaluations :", err);

        if (!ignore) {
          setAssignments([]);
          setTeachers([]);
          setClassrooms([]);
          setError(
            "Impossible de charger les devoirs et évaluations pour le moment."
          );
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

  const filteredAssignments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !query ||
        [
          assignment.title,
          assignment.description,
          assignment.teacher_name,
          assignment.classroom_name,
          assignment.due_date,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "all" ||
        assignment.assignment_type === typeFilter;

      const matchesClassroom =
        classroomFilter === "all" ||
        String(assignment.classroom) === classroomFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && assignment.is_published) ||
        (statusFilter === "draft" && !assignment.is_published);

      return (
        matchesSearch &&
        matchesType &&
        matchesClassroom &&
        matchesStatus
      );
    });
  }, [
    assignments,
    search,
    typeFilter,
    classroomFilter,
    statusFilter,
  ]);

  const publishedCount = assignments.filter(
    (assignment) => assignment.is_published
  ).length;

  const draftCount = assignments.length - publishedCount;

  function updateForm(field: keyof AssignmentForm, value: string) {
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

  function openEditForm(assignment: Assignment) {
    setForm({
      title: assignment.title,
      assignment_type: assignment.assignment_type,
      description: assignment.description ?? "",
      classroom: assignment.classroom
        ? String(assignment.classroom)
        : "",
      teacher: assignment.teacher ? String(assignment.teacher) : "",
      due_date: assignment.due_date ?? "",
      max_score:
        assignment.max_score === null || assignment.max_score === undefined
          ? ""
          : String(assignment.max_score),
    });

    setEditingId(assignment.id);
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
      title: form.title.trim(),
      assignment_type: form.assignment_type,
      description: form.description.trim() || undefined,
      classroom: form.classroom ? Number(form.classroom) : null,
      teacher: form.teacher ? Number(form.teacher) : null,
      due_date: form.due_date || undefined,
      max_score: form.max_score ? Number(form.max_score) : null,
    };

    try {
      if (editingId) {
        const updatedAssignment = await apiPatch<Assignment>(
          `/assignments/${editingId}/`,
          payload
        );

        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === editingId
              ? { ...assignment, ...updatedAssignment }
              : assignment
          )
        );

        setSuccess("Devoir ou évaluation modifié avec succès.");
      } else {
        const createdAssignment = await apiPost<Assignment>(
          "/assignments/",
          payload
        );

        setAssignments((current) => [createdAssignment, ...current]);
        setSuccess("Devoir ou évaluation créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du devoir :", err);
      setError(
        editingId
          ? "Impossible de modifier ce devoir ou cette évaluation."
          : "Impossible de créer ce devoir ou cette évaluation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(assignment: Assignment) {
    setError("");
    setSuccess("");
    setUpdatingId(assignment.id);

    const nextIsPublished = !assignment.is_published;

    try {
      await apiPatch(`/assignments/${assignment.id}/`, {
        is_published: nextIsPublished,
      });

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Devoir publié avec succès."
          : "Devoir retiré de la publication."
      );
    } catch (err) {
      console.error("Erreur modification de la publication :", err);
      setError("Impossible de modifier la publication de ce devoir.");
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
            Devoirs et évaluations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez les devoirs, contrôles et évaluations destinés aux élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadAssignments}
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
            Créer un devoir
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={assignments.length} />
        <StatCard title="Publiés" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard title="Classes" value={classrooms.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier le devoir ou l'évaluation"
              : "Créer un devoir ou une évaluation"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Contrôle de récitation - Sourate Al-Fatiha"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>

              <select
                value={form.assignment_type}
                onChange={(event) =>
                  updateForm(
                    "assignment_type",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Classe
              </label>

              <select
                value={form.classroom}
                onChange={(event) =>
                  updateForm("classroom", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non affectée</option>

                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Enseignant
              </label>

              <select
                value={form.teacher}
                onChange={(event) =>
                  updateForm("teacher", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non attribué</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Date limite"
              type="date"
              value={form.due_date}
              onChange={(value) => updateForm("due_date", value)}
            />

            <FormField
              label="Note maximale"
              type="number"
              value={form.max_score}
              onChange={(value) => updateForm("max_score", value)}
              placeholder="Exemple : 20"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Consignes, contenu ou objectifs"
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
                  : "Créer le devoir"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un devoir ou une évaluation..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as "all" | AssignmentType)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>

          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>

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

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "published" | "draft"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des devoirs et évaluations
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredAssignments.length} élément(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredAssignments.length === 0 ? (
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
                {filteredAssignments.map((assignment) => {
                  const isUpdating = updatingId === assignment.id;

                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {assignment.title}
                        </div>

                        {assignment.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {assignment.description}
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
                          {assignment.is_published ? "Publié" : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(assignment)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(assignment)}
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