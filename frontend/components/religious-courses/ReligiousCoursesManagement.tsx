"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type CourseSubject = "quran" | "hadith" | "fiqh" | "aqidah" | "arabic" | "other";

type ReligiousCourse = {
  id: number;
  title: string;
  subject: CourseSubject;
  description?: string;
  teacher?: number | null;
  teacher_name?: string;
  classroom?: number | null;
  classroom_name?: string;
  schedule?: string;
  is_active: boolean;
};

type ReligiousCourseForm = {
  title: string;
  subject: CourseSubject;
  description: string;
  teacher: string;
  classroom: string;
  schedule: string;
};

const EMPTY_FORM: ReligiousCourseForm = {
  title: "",
  subject: "quran",
  description: "",
  teacher: "",
  classroom: "",
  schedule: "",
};

const SUBJECT_LABELS: Record<CourseSubject, string> = {
  quran: "Coran",
  hadith: "Hadith",
  fiqh: "Fiqh",
  aqidah: "Aqidah",
  arabic: "Arabe",
  other: "Autre",
};

const SUBJECT_OPTIONS: CourseSubject[] = [
  "quran",
  "hadith",
  "fiqh",
  "aqidah",
  "arabic",
  "other",
];

export default function ReligiousCoursesManagement() {
  const [courses, setCourses] = useState<ReligiousCourse[]>([]);
  const [teachers, setTeachers] = useState<
    Array<{ id: number; first_name: string; last_name: string }>
  >([]);
  const [classrooms, setClassrooms] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<"all" | CourseSubject>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ReligiousCourseForm>(EMPTY_FORM);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesData, teachersData, classroomsData] = await Promise.all([
        apiGetList<ReligiousCourse[]>("/religious-courses/"),
        apiGetList<Array<{ id: number; first_name: string; last_name: string }>>(
          "/users/?role=teacher"
        ),
        apiGetList<Array<{ id: number; name: string }>>("/classrooms/"),
      ]);

      setCourses(coursesData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des cours religieux :", err);
      setCourses([]);
      setTeachers([]);
      setClassrooms([]);
      setError("Impossible de charger les cours religieux pour le moment.");
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
        const [coursesData, teachersData, classroomsData] = await Promise.all([
          apiGetList<ReligiousCourse[]>("/religious-courses/"),
          apiGetList<Array<{ id: number; first_name: string; last_name: string }>>(
            "/users/?role=teacher"
          ),
          apiGetList<Array<{ id: number; name: string }>>("/classrooms/"),
        ]);

        if (!ignore) {
          setCourses(coursesData);
          setTeachers(teachersData);
          setClassrooms(classroomsData);
        }
      } catch (err) {
        console.error("Erreur chargement des cours religieux :", err);

        if (!ignore) {
          setCourses([]);
          setTeachers([]);
          setClassrooms([]);
          setError("Impossible de charger les cours religieux pour le moment.");
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

  const filteredCourses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [
          course.title,
          course.description,
          course.teacher_name,
          course.classroom_name,
          course.schedule,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesSubject =
        subjectFilter === "all" || course.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && course.is_active) ||
        (statusFilter === "inactive" && !course.is_active);

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [courses, search, subjectFilter, statusFilter]);

  const activeCount = courses.filter((course) => course.is_active).length;
  const inactiveCount = courses.length - activeCount;

  function updateForm(field: keyof ReligiousCourseForm, value: string) {
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

  function openEditForm(course: ReligiousCourse) {
    setForm({
      title: course.title,
      subject: course.subject,
      description: course.description ?? "",
      teacher: course.teacher ? String(course.teacher) : "",
      classroom: course.classroom ? String(course.classroom) : "",
      schedule: course.schedule ?? "",
    });

    setEditingId(course.id);
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
      subject: form.subject,
      description: form.description.trim() || undefined,
      teacher: form.teacher ? Number(form.teacher) : null,
      classroom: form.classroom ? Number(form.classroom) : null,
      schedule: form.schedule.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedCourse = await apiPatch<ReligiousCourse>(
          `/religious-courses/${editingId}/`,
          payload
        );

        setCourses((current) =>
          current.map((course) =>
            course.id === editingId
              ? { ...course, ...updatedCourse }
              : course
          )
        );

        setSuccess("Cours modifié avec succès.");
      } else {
        const createdCourse = await apiPost<ReligiousCourse>(
          "/religious-courses/",
          payload
        );

        setCourses((current) => [createdCourse, ...current]);
        setSuccess("Cours créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du cours :", err);
      setError(
        editingId
          ? "Impossible de modifier ce cours."
          : "Impossible de créer ce cours."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(course: ReligiousCourse) {
    setError("");
    setSuccess("");
    setUpdatingId(course.id);

    const nextIsActive = !course.is_active;

    try {
      await apiPatch(`/religious-courses/${course.id}/`, {
        is_active: nextIsActive,
      });

      setCourses((current) =>
        current.map((item) =>
          item.id === course.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Cours activé avec succès."
          : "Cours désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ce cours.");
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
            Cours religieux
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les cours de Coran, hadith, fiqh et autres enseignements religieux.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadCourses}
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
            Créer un cours
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total cours" value={courses.length} />
        <StatCard title="Cours actifs" value={activeCount} />
        <StatCard title="Cours inactifs" value={inactiveCount} />
        <StatCard title="Enseignants disponibles" value={teachers.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? "Modifier le cours" : "Créer un nouveau cours"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre du cours"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Récitation du Coran - Niveau 1"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Matière <span className="text-red-500">*</span>
              </label>

              <select
                value={form.subject}
                onChange={(event) =>
                  updateForm("subject", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject} value={subject}>
                    {SUBJECT_LABELS[subject]}
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

            <FormField
              label="Horaires"
              value={form.schedule}
              onChange={(value) => updateForm("schedule", value)}
              placeholder="Exemple : Samedi, 10h00 - 12h00"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Contenu, objectifs ou précisions sur le cours"
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
                  : "Créer le cours"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un cours..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={subjectFilter}
          onChange={(event) =>
            setSubjectFilter(event.target.value as "all" | CourseSubject)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les matières</option>

          {SUBJECT_OPTIONS.map((subject) => (
            <option key={subject} value={subject}>
              {SUBJECT_LABELS[subject]}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "active" | "inactive"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des cours religieux</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredCourses.length} cours
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredCourses.length === 0 ? (
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
                {filteredCourses.map((course) => {
                  const isUpdating = updatingId === course.id;

                  return (
                    <tr key={course.id} className="hover:bg-gray-50">
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

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {SUBJECT_LABELS[course.subject]}
                        </span>
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
                            onClick={() => openEditForm(course)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(course)}
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
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="text"
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