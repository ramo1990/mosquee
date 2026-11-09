"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  classroom?: number | null;
  classroom_name?: string;
  is_active: boolean;
};

type Classroom = {
  id: number;
  name: string;
};

type StudentForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  classroom: string;
};

const EMPTY_FORM: StudentForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birth_date: "",
  classroom: "",
};

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [classroomFilter, setClassroomFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData] = await Promise.all([
        apiGetList<Student[]>("/students/"),
        apiGetList<Classroom[]>("/classrooms/"),
      ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des élèves :", err);
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
        }
      } catch (err) {
        console.error("Erreur chargement des élèves :", err);

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
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.first_name,
          student.last_name,
          student.username,
          student.email,
          student.phone,
          student.classroom_name,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && student.is_active) ||
        (statusFilter === "inactive" && !student.is_active);

      const matchesClassroom =
        classroomFilter === "all" ||
        String(student.classroom) === classroomFilter;

      return matchesSearch && matchesStatus && matchesClassroom;
    });
  }, [students, search, statusFilter, classroomFilter]);

  const activeCount = students.filter((student) => student.is_active).length;
  const inactiveCount = students.length - activeCount;

  function updateForm(field: keyof StudentForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        birth_date: form.birth_date || undefined,
        classroom: form.classroom ? Number(form.classroom) : null,
      };

      const createdStudent = await apiPost<Student>("/students/", payload);

      setStudents((current) => [createdStudent, ...current]);

      setForm(EMPTY_FORM);
      setShowForm(false);
      setSuccess("Élève inscrit avec succès.");
    } catch (err) {
      console.error("Erreur inscription de l'élève :", err);
      setError("Impossible d'inscrire cet élève. Vérifiez les informations saisies.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleStatus(student: Student) {
    setError("");
    setSuccess("");
    setUpdatingId(student.id);

    const nextIsActive = !student.is_active;

    try {
      await apiPatch(`/students/${student.id}/`, {
        is_active: nextIsActive,
      });

      setStudents((current) =>
        current.map((item) =>
          item.id === student.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Élève activé avec succès."
          : "Élève désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cet élève.");
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
            Gestion des élèves
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Inscrivez, consultez et suivez les élèves de vos classes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadStudents}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            {showForm ? "Fermer le formulaire" : "Inscrire un élève"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total élèves" value={students.length} />
        <StatCard title="Élèves actifs" value={activeCount} />
        <StatCard title="Élèves inactifs" value={inactiveCount} />
        <StatCard title="Classes disponibles" value={classrooms.length} />
      </div>

      {showForm && (
        <form
          onSubmit={createStudent}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            Inscrire un nouvel élève
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Prénom"
              value={form.first_name}
              onChange={(value) => updateForm("first_name", value)}
              required
            />

            <FormField
              label="Nom"
              value={form.last_name}
              onChange={(value) => updateForm("last_name", value)}
              required
            />

            <FormField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateForm("email", value)}
            />

            <FormField
              label="Téléphone"
              value={form.phone}
              onChange={(value) => updateForm("phone", value)}
            />

            <FormField
              label="Date de naissance"
              type="date"
              value={form.birth_date}
              onChange={(value) => updateForm("birth_date", value)}
            />

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
                <option value="">Sélectionner une classe</option>

                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(false);
              }}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {creating ? "Inscription..." : "Inscrire l'élève"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un élève..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | "active" | "inactive")
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des élèves</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredStudents.length} élève(s)
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
              Inscrivez un nouvel élève ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Élève</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Classe</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const isUpdating = updatingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
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
                            onClick={() => toggleStatus(student)}
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
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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