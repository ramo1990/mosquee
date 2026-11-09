"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type LearningProgram = {
  id: number;
  title: string;
  level?: string;
  description?: string;
  objectives?: string;
  content?: string;
  duration_weeks?: number | null;
  is_active: boolean;
};

type ProgramForm = {
  title: string;
  level: string;
  description: string;
  objectives: string;
  content: string;
  duration_weeks: string;
};

const EMPTY_FORM: ProgramForm = {
  title: "",
  level: "",
  description: "",
  objectives: "",
  content: "",
  duration_weeks: "",
};

export default function LearningProgramsManagement() {
  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<LearningProgram[]>(
        "/learning-programs/"
      );

      setPrograms(data);
    } catch (err) {
      console.error("Erreur chargement des programmes :", err);
      setPrograms([]);
      setError(
        "Impossible de charger les programmes d'apprentissage pour le moment."
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
        const data = await apiGetList<LearningProgram[]>(
          "/learning-programs/"
        );

        if (!ignore) {
          setPrograms(data);
        }
      } catch (err) {
        console.error("Erreur chargement des programmes :", err);

        if (!ignore) {
          setPrograms([]);
          setError(
            "Impossible de charger les programmes d'apprentissage pour le moment."
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

  const availableLevels = useMemo(() => {
    const levels = new Set<string>();

    programs.forEach((program) => {
      if (program.level) {
        levels.add(program.level);
      }
    });

    return Array.from(levels).sort();
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const query = search.toLowerCase().trim();

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [
          program.title,
          program.level,
          program.description,
          program.objectives,
          program.content,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesLevel =
        levelFilter === "all" || program.level === levelFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && program.is_active) ||
        (statusFilter === "inactive" && !program.is_active);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [programs, search, levelFilter, statusFilter]);

  const activeCount = programs.filter(
    (program) => program.is_active
  ).length;

  const inactiveCount = programs.length - activeCount;

  function updateForm(field: keyof ProgramForm, value: string) {
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

  function openEditForm(program: LearningProgram) {
    setForm({
      title: program.title,
      level: program.level ?? "",
      description: program.description ?? "",
      objectives: program.objectives ?? "",
      content: program.content ?? "",
      duration_weeks:
        program.duration_weeks === null ||
        program.duration_weeks === undefined
          ? ""
          : String(program.duration_weeks),
    });

    setEditingId(program.id);
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
      level: form.level.trim() || undefined,
      description: form.description.trim() || undefined,
      objectives: form.objectives.trim() || undefined,
      content: form.content.trim() || undefined,
      duration_weeks: form.duration_weeks
        ? Number(form.duration_weeks)
        : null,
    };

    try {
      if (editingId) {
        const updatedProgram = await apiPatch<LearningProgram>(
          `/learning-programs/${editingId}/`,
          payload
        );

        setPrograms((current) =>
          current.map((program) =>
            program.id === editingId
              ? { ...program, ...updatedProgram }
              : program
          )
        );

        setSuccess("Programme modifié avec succès.");
      } else {
        const createdProgram = await apiPost<LearningProgram>(
          "/learning-programs/",
          payload
        );

        setPrograms((current) => [createdProgram, ...current]);
        setSuccess("Programme créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du programme :", err);
      setError(
        editingId
          ? "Impossible de modifier ce programme."
          : "Impossible de créer ce programme."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(program: LearningProgram) {
    setError("");
    setSuccess("");
    setUpdatingId(program.id);

    const nextIsActive = !program.is_active;

    try {
      await apiPatch(`/learning-programs/${program.id}/`, {
        is_active: nextIsActive,
      });

      setPrograms((current) =>
        current.map((item) =>
          item.id === program.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Programme activé avec succès."
          : "Programme désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ce programme.");
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
            Programmes d’apprentissage
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Définissez les programmes, objectifs et contenus pédagogiques.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadPrograms}
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
            Créer un programme
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total programmes" value={programs.length} />
        <StatCard title="Programmes actifs" value={activeCount} />
        <StatCard title="Programmes inactifs" value={inactiveCount} />
        <StatCard title="Niveaux disponibles" value={availableLevels.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier le programme"
              : "Créer un nouveau programme"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre du programme"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Programme Coran - Niveau débutant"
                required
              />
            </div>

            <FormField
              label="Niveau"
              value={form.level}
              onChange={(value) => updateForm("level", value)}
              placeholder="Exemple : Débutant, Intermédiaire, Avancé"
            />

            <FormField
              label="Durée en semaines"
              type="number"
              value={form.duration_weeks}
              onChange={(value) => updateForm("duration_weeks", value)}
              placeholder="Exemple : 12"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Présentation générale du programme"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Objectifs pédagogiques"
                value={form.objectives}
                onChange={(value) => updateForm("objectives", value)}
                placeholder="Exemple : Mémoriser les sourates courtes, améliorer la récitation"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Contenu pédagogique"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Modules, leçons, supports et activités"
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
                  : "Créer le programme"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un programme..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les niveaux</option>

          {availableLevels.map((level) => (
            <option key={level} value={level}>
              {level}
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
          <h3 className="font-bold text-gray-900">
            Liste des programmes
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredPrograms.length} programme(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun programme trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez un nouveau programme ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Programme</th>
                  <th className="px-6 py-4">Niveau</th>
                  <th className="px-6 py-4">Durée</th>
                  <th className="px-6 py-4">Objectifs</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPrograms.map((program) => {
                  const isUpdating = updatingId === program.id;

                  return (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {program.title}
                        </div>

                        {program.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {program.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {program.level || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {program.duration_weeks
                          ? `${program.duration_weeks} semaine(s)`
                          : "—"}
                      </td>

                      <td className="px-6 py-4 max-w-xs text-gray-600">
                        {program.objectives || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            program.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {program.is_active ? "Actif" : "Inactif"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(program)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(program)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              program.is_active
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : program.is_active
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