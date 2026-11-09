"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type ActivityType =
  | "meeting"
  | "training"
  | "community_event"
  | "charity"
  | "other";

type ActivityStatus = "planned" | "ongoing" | "completed" | "cancelled";

type Activity = {
  id: number;
  title: string;
  activity_type: ActivityType;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  organizer?: string;
  max_participants?: number | null;
  participant_count?: number;
  status: ActivityStatus;
  is_published: boolean;
};

type ActivityForm = {
  title: string;
  activity_type: ActivityType;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  max_participants: string;
  status: ActivityStatus;
};

const EMPTY_FORM: ActivityForm = {
  title: "",
  activity_type: "community_event",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  organizer: "",
  max_participants: "",
  status: "planned",
};

const TYPE_LABELS: Record<ActivityType, string> = {
  meeting: "Réunion",
  training: "Formation",
  community_event: "Événement communautaire",
  charity: "Action caritative",
  other: "Autre",
};

const TYPE_OPTIONS: ActivityType[] = [
  "meeting",
  "training",
  "community_event",
  "charity",
  "other",
];

const STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: "Planifiée",
  ongoing: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<ActivityStatus, string> = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: ActivityStatus[] = [
  "planned",
  "ongoing",
  "completed",
  "cancelled",
];

export default function ActivitiesManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | ActivityType
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ActivityStatus
  >("all");
  const [publicationFilter, setPublicationFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ActivityForm>(EMPTY_FORM);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Activity[]>("/activities/");

      setActivities(data);
    } catch (err) {
      console.error("Erreur chargement des activités :", err);
      setActivities([]);
      setError(
        "Impossible de charger les activités pour le moment."
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
        const data = await apiGetList<Activity[]>("/activities/");

        if (!ignore) {
          setActivities(data);
        }
      } catch (err) {
        console.error("Erreur chargement des activités :", err);

        if (!ignore) {
          setActivities([]);
          setError(
            "Impossible de charger les activités pour le moment."
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

  const filteredActivities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return activities
      .filter((activity) => {
        const matchesSearch =
          !query ||
          [
            activity.title,
            activity.description,
            activity.location,
            activity.organizer,
            activity.start_date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" ||
          activity.activity_type === typeFilter;

        const matchesStatus =
          statusFilter === "all" || activity.status === statusFilter;

        const matchesPublication =
          publicationFilter === "all" ||
          (publicationFilter === "published" && activity.is_published) ||
          (publicationFilter === "draft" && !activity.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesStatus &&
          matchesPublication
        );
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [
    activities,
    search,
    typeFilter,
    statusFilter,
    publicationFilter,
  ]);

  const plannedCount = activities.filter(
    (activity) => activity.status === "planned"
  ).length;

  const ongoingCount = activities.filter(
    (activity) => activity.status === "ongoing"
  ).length;

  const completedCount = activities.filter(
    (activity) => activity.status === "completed"
  ).length;

  const publishedCount = activities.filter(
    (activity) => activity.is_published
  ).length;

  function updateForm(field: keyof ActivityForm, value: string) {
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

  function openEditForm(activity: Activity) {
    setForm({
      title: activity.title,
      activity_type: activity.activity_type,
      description: activity.description ?? "",
      location: activity.location ?? "",
      start_date: activity.start_date,
      end_date: activity.end_date ?? "",
      start_time: activity.start_time ?? "",
      end_time: activity.end_time ?? "",
      organizer: activity.organizer ?? "",
      max_participants:
        activity.max_participants === null ||
        activity.max_participants === undefined
          ? ""
          : String(activity.max_participants),
      status: activity.status,
    });

    setEditingId(activity.id);
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
      activity_type: form.activity_type,
      description: form.description.trim() || undefined,
      location: form.location.trim() || undefined,
      start_date: form.start_date,
      end_date: form.end_date || undefined,
      start_time: form.start_time || undefined,
      end_time: form.end_time || undefined,
      organizer: form.organizer.trim() || undefined,
      max_participants: form.max_participants
        ? Number(form.max_participants)
        : null,
      status: form.status,
    };

    try {
      if (editingId) {
        const updatedActivity = await apiPatch<Activity>(
          `/activities/${editingId}/`,
          payload
        );

        setActivities((current) =>
          current.map((activity) =>
            activity.id === editingId
              ? { ...activity, ...updatedActivity }
              : activity
          )
        );

        setSuccess("Activité modifiée avec succès.");
      } else {
        const createdActivity = await apiPost<Activity>(
          "/activities/",
          payload
        );

        setActivities((current) => [createdActivity, ...current]);
        setSuccess("Activité créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'activité :", err);
      setError(
        editingId
          ? "Impossible de modifier cette activité."
          : "Impossible de créer cette activité."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(activity: Activity) {
    setError("");
    setSuccess("");
    setUpdatingId(activity.id);

    const nextIsPublished = !activity.is_published;

    try {
      await apiPatch(`/activities/${activity.id}/`, {
        is_published: nextIsPublished,
      });

      setActivities((current) =>
        current.map((item) =>
          item.id === activity.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Activité publiée avec succès."
          : "Activité retirée de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de cette activité."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function changeStatus(
    activity: Activity,
    status: ActivityStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(activity.id);

    try {
      const updatedActivity = await apiPatch<Activity>(
        `/activities/${activity.id}/`,
        {
          status,
        }
      );

      setActivities((current) =>
        current.map((item) =>
          item.id === activity.id
            ? { ...item, ...updatedActivity }
            : item
        )
      );

      setSuccess(
        `Activité marquée comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cette activité.");
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
            Activités et événements
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et suivez les activités, rencontres, formations et événements de la communauté.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadActivities}
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
            Nouvelle activité
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Planifiées" value={plannedCount} />
        <StatCard title="En cours" value={ongoingCount} />
        <StatCard title="Terminées" value={completedCount} />
        <StatCard title="Publiées" value={publishedCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'activité"
              : "Créer une nouvelle activité"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Journée portes ouvertes"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d'activité
              </label>

              <select
                value={form.activity_type}
                onChange={(event) =>
                  updateForm("activity_type", event.target.value)
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
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm("status", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Lieu"
              value={form.location}
              onChange={(value) => updateForm("location", value)}
              placeholder="Exemple : Salle principale de la mosquée"
            />

            <FormField
              label="Organisateur"
              value={form.organizer}
              onChange={(value) => updateForm("organizer", value)}
              placeholder="Exemple : Comité culturel"
            />

            <FormField
              label="Date de début"
              type="date"
              value={form.start_date}
              onChange={(value) => updateForm("start_date", value)}
              required
            />

            <FormField
              label="Date de fin"
              type="date"
              value={form.end_date}
              onChange={(value) => updateForm("end_date", value)}
            />

            <FormField
              label="Heure de début"
              type="time"
              value={form.start_time}
              onChange={(value) => updateForm("start_time", value)}
            />

            <FormField
              label="Heure de fin"
              type="time"
              value={form.end_time}
              onChange={(value) => updateForm("end_time", value)}
            />

            <FormField
              label="Nombre maximum de participants"
              type="number"
              value={form.max_participants}
              onChange={(value) =>
                updateForm("max_participants", value)
              }
              placeholder="Exemple : 50"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Objectifs, programme ou informations pratiques"
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
                  : "Créer l'activité"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_170px_170px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une activité..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value as "all" | ActivityType
            )
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
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | ActivityStatus
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          value={publicationFilter}
          onChange={(event) =>
            setPublicationFilter(
              event.target.value as "all" | "published" | "draft"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiées</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des activités
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredActivities.length} activité(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune activité trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle activité ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Activité</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Lieu</th>
                  <th className="px-6 py-4">Participants</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredActivities.map((activity) => {
                  const isUpdating = updatingId === activity.id;

                  return (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {activity.title}
                        </div>

                        {activity.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {activity.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {TYPE_LABELS[activity.activity_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {activity.start_date}
                        {activity.end_date &&
                          activity.end_date !== activity.start_date
                          ? ` → ${activity.end_date}`
                          : ""}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {activity.location || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {activity.participant_count ?? 0}
                        {activity.max_participants
                          ? ` / ${activity.max_participants}`
                          : ""}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[activity.status]}`}
                        >
                          {STATUS_LABELS[activity.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(activity)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePublication(activity)
                            }
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              activity.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : activity.is_published
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