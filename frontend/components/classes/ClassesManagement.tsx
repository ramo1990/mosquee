"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type Classroom = {
  id: number;
  name: string;
  level?: string;
  description?: string;
  student_count?: number;
  is_active: boolean;
};

type ClassroomForm = {
  name: string;
  level: string;
  description: string;
};

const EMPTY_FORM: ClassroomForm = {
  name: "",
  level: "",
  description: "",
};

export default function ClassesManagement() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClassroomForm>(EMPTY_FORM);

  const loadClassrooms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Classroom[]>("/classrooms/");

      setClassrooms(data);
    } catch (err) {
      console.error("Erreur chargement des classes :", err);
      setClassrooms([]);
      setError("Impossible de charger les classes pour le moment.");
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
        const data = await apiGetList<Classroom[]>("/classrooms/");

        if (!ignore) {
          setClassrooms(data);
        }
      } catch (err) {
        console.error("Erreur chargement des classes :", err);

        if (!ignore) {
          setClassrooms([]);
          setError("Impossible de charger les classes pour le moment.");
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

  const filteredClassrooms = useMemo(() => {
    const query = search.toLowerCase().trim();

    return classrooms.filter((classroom) => {
      const matchesSearch =
        !query ||
        [
          classroom.name,
          classroom.level,
          classroom.description,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && classroom.is_active) ||
        (statusFilter === "inactive" && !classroom.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [classrooms, search, statusFilter]);

  const activeCount = classrooms.filter(
    (classroom) => classroom.is_active
  ).length;

  const inactiveCount = classrooms.length - activeCount;

  const totalStudents = classrooms.reduce(
    (total, classroom) => total + (classroom.student_count ?? 0),
    0
  );

  function updateForm(field: keyof ClassroomForm, value: string) {
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

  function openEditForm(classroom: Classroom) {
    setForm({
      name: classroom.name,
      level: classroom.level ?? "",
      description: classroom.description ?? "",
    });

    setEditingId(classroom.id);
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
      name: form.name.trim(),
      level: form.level.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedClassroom = await apiPatch<Classroom>(
          `/classrooms/${editingId}/`,
          payload
        );

        setClassrooms((current) =>
          current.map((classroom) =>
            classroom.id === editingId
              ? { ...classroom, ...updatedClassroom }
              : classroom
          )
        );

        setSuccess("Classe modifiée avec succès.");
      } else {
        const createdClassroom = await apiPost<Classroom>(
          "/classrooms/",
          payload
        );

        setClassrooms((current) => [createdClassroom, ...current]);
        setSuccess("Classe créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la classe :", err);
      setError(
        editingId
          ? "Impossible de modifier cette classe."
          : "Impossible de créer cette classe."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(classroom: Classroom) {
    setError("");
    setSuccess("");
    setUpdatingId(classroom.id);

    const nextIsActive = !classroom.is_active;

    try {
      await apiPatch(`/classrooms/${classroom.id}/`, {
        is_active: nextIsActive,
      });

      setClassrooms((current) =>
        current.map((item) =>
          item.id === classroom.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Classe activée avec succès."
          : "Classe désactivée avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cette classe.");
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
            Gestion des classes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et gérez les classes, niveaux et groupes d’élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadClassrooms}
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
            Créer une classe
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total classes" value={classrooms.length} />
        <StatCard title="Classes actives" value={activeCount} />
        <StatCard title="Classes inactives" value={inactiveCount} />
        <StatCard title="Élèves affectés" value={totalStudents} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? "Modifier la classe" : "Créer une nouvelle classe"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Nom de la classe"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
              placeholder="Exemple : Classe A - Niveau 1"
              required
            />

            <FormField
              label="Niveau"
              value={form.level}
              onChange={(value) => updateForm("level", value)}
              placeholder="Exemple : Débutant, Intermédiaire, Avancé"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Description de la classe"
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
                  : "Créer la classe"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une classe..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

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
          <option value="active">Actives</option>
          <option value="inactive">Inactives</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des classes</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredClassrooms.length} classe(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredClassrooms.length === 0 ? (
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
                {filteredClassrooms.map((classroom) => {
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
                            onClick={() => openEditForm(classroom)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(classroom)}
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