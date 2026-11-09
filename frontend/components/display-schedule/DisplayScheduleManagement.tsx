"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type DisplaySchedule = {
  id: number;
  title: string;
  content?: string;
  screen_group?: string;
  start_datetime: string;
  end_datetime: string;
  priority: number;
  is_active: boolean;
};

type ScheduleForm = {
  title: string;
  content: string;
  screen_group: string;
  start_datetime: string;
  end_datetime: string;
  priority: string;
};

const EMPTY_FORM: ScheduleForm = {
  title: "",
  content: "",
  screen_group: "",
  start_datetime: "",
  end_datetime: "",
  priority: "1",
};

export default function DisplayScheduleManagement() {
  const [schedules, setSchedules] = useState<DisplaySchedule[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<DisplaySchedule[]>(
        "/display-schedules/"
      );

      setSchedules(data);
    } catch (err) {
      console.error(
        "Erreur chargement de la programmation :",
        err
      );
      setSchedules([]);
      setError(
        "Impossible de charger la programmation des affichages pour le moment."
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
        const data = await apiGetList<DisplaySchedule[]>(
          "/display-schedules/"
        );

        if (!ignore) {
          setSchedules(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement de la programmation :",
          err
        );

        if (!ignore) {
          setSchedules([]);
          setError(
            "Impossible de charger la programmation des affichages pour le moment."
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

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    schedules.forEach((schedule) => {
      if (schedule.screen_group) {
        groups.add(schedule.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    const query = search.toLowerCase().trim();

    return schedules
      .filter((schedule) => {
        const matchesSearch =
          !query ||
          [
            schedule.title,
            schedule.content,
            schedule.screen_group,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesGroup =
          groupFilter === "all" ||
          schedule.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && schedule.is_active) ||
          (statusFilter === "inactive" && !schedule.is_active);

        return matchesSearch && matchesGroup && matchesStatus;
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }

        return a.start_datetime.localeCompare(b.start_datetime);
      });
  }, [schedules, search, groupFilter, statusFilter]);

  const activeCount = schedules.filter(
    (schedule) => schedule.is_active
  ).length;

  const inactiveCount = schedules.length - activeCount;

  function updateForm(field: keyof ScheduleForm, value: string) {
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

  function openEditForm(schedule: DisplaySchedule) {
    setForm({
      title: schedule.title,
      content: schedule.content ?? "",
      screen_group: schedule.screen_group ?? "",
      start_datetime: schedule.start_datetime,
      end_datetime: schedule.end_datetime,
      priority: String(schedule.priority),
    });

    setEditingId(schedule.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim() || undefined,
      screen_group: form.screen_group.trim() || undefined,
      start_datetime: form.start_datetime,
      end_datetime: form.end_datetime,
      priority: Number(form.priority),
    };

    try {
      if (editingId) {
        const updatedSchedule = await apiPatch<DisplaySchedule>(
          `/display-schedules/${editingId}/`,
          payload
        );

        setSchedules((current) =>
          current.map((schedule) =>
            schedule.id === editingId
              ? { ...schedule, ...updatedSchedule }
              : schedule
          )
        );

        setSuccess("Programmation modifiée avec succès.");
      } else {
        const createdSchedule = await apiPost<DisplaySchedule>(
          "/display-schedules/",
          payload
        );

        setSchedules((current) => [createdSchedule, ...current]);
        setSuccess("Programmation créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Erreur enregistrement de la programmation :",
        err
      );
      setError(
        editingId
          ? "Impossible de modifier cette programmation."
          : "Impossible de créer cette programmation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(schedule: DisplaySchedule) {
    setError("");
    setSuccess("");
    setUpdatingId(schedule.id);

    const nextIsActive = !schedule.is_active;

    try {
      await apiPatch(`/display-schedules/${schedule.id}/`, {
        is_active: nextIsActive,
      });

      setSchedules((current) =>
        current.map((item) =>
          item.id === schedule.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Programmation activée avec succès."
          : "Programmation désactivée avec succès."
      );
    } catch (err) {
      console.error(
        "Erreur modification du statut :",
        err
      );
      setError(
        "Impossible de modifier le statut de cette programmation."
      );
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
            Programmation des affichages
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Planifiez les contenus, horaires et priorités d’affichage sur les écrans.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadSchedules}
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
            Nouvelle programmation
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total programmations" value={schedules.length} />
        <StatCard title="Actives" value={activeCount} />
        <StatCard title="Inactives" value={inactiveCount} />
        <StatCard
          title="Groupes d’écrans"
          value={availableGroups.length}
        />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier la programmation"
              : "Créer une nouvelle programmation"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Annonce du vendredi"
                required
              />
            </div>

            <FormField
              label="Groupe d’écrans"
              value={form.screen_group}
              onChange={(value) =>
                updateForm("screen_group", value)
              }
              placeholder="Exemple : Accueil, Salle de prière"
            />

            <FormField
              label="Priorité"
              type="number"
              value={form.priority}
              onChange={(value) => updateForm("priority", value)}
              placeholder="Exemple : 1"
              required
            />

            <FormField
              label="Début"
              type="datetime-local"
              value={form.start_datetime}
              onChange={(value) =>
                updateForm("start_datetime", value)
              }
              required
            />

            <FormField
              label="Fin"
              type="datetime-local"
              value={form.end_datetime}
              onChange={(value) =>
                updateForm("end_datetime", value)
              }
              required
            />

            <div className="md:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Texte ou description du contenu diffusé"
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
                  : "Créer la programmation"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une programmation..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={groupFilter}
          onChange={(event) => setGroupFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les groupes</option>

          {availableGroups.map((group) => (
            <option key={group} value={group}>
              {group}
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
          <option value="active">Actives</option>
          <option value="inactive">Inactives</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des programmations
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredSchedules.length} programmation(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune programmation trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle programmation ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Programmation</th>
                  <th className="px-6 py-4">Groupe</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Début</th>
                  <th className="px-6 py-4">Fin</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSchedules.map((schedule) => {
                  const isUpdating = updatingId === schedule.id;

                  return (
                    <tr
                      key={schedule.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {schedule.title}
                        </div>

                        {schedule.content && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {schedule.content}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {schedule.screen_group || "—"}
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        {schedule.priority}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(
                          schedule.start_datetime
                        ).toLocaleString("fr-FR")}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(
                          schedule.end_datetime
                        ).toLocaleString("fr-FR")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            schedule.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {schedule.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(schedule)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(schedule)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              schedule.is_active
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : schedule.is_active
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