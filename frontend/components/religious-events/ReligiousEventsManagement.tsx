"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type ReligiousEventType =
  | "eid"
  | "ramadan"
  | "mawlid"
  | "ashura"
  | "conference"
  | "other";

type EventStatus = "planned" | "ongoing" | "completed" | "cancelled";

type ReligiousEvent = {
  id: number;
  title: string;
  event_type: ReligiousEventType;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  organizer?: string;
  max_participants?: number | null;
  participant_count?: number;
  status: EventStatus;
  is_published: boolean;
};

type ReligiousEventForm = {
  title: string;
  event_type: ReligiousEventType;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  max_participants: string;
  status: EventStatus;
};

const EMPTY_FORM: ReligiousEventForm = {
  title: "",
  event_type: "conference",
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

const TYPE_LABELS: Record<ReligiousEventType, string> = {
  eid: "Aïd",
  ramadan: "Ramadan",
  mawlid: "Mawlid",
  ashura: "Achoura",
  conference: "Conférence",
  other: "Autre",
};

const TYPE_OPTIONS: ReligiousEventType[] = [
  "eid",
  "ramadan",
  "mawlid",
  "ashura",
  "conference",
  "other",
];

const STATUS_LABELS: Record<EventStatus, string> = {
  planned: "Planifié",
  ongoing: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<EventStatus, string> = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: EventStatus[] = [
  "planned",
  "ongoing",
  "completed",
  "cancelled",
];

export default function ReligiousEventsManagement() {
  const [events, setEvents] = useState<ReligiousEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | ReligiousEventType
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | EventStatus
  >("all");
  const [publicationFilter, setPublicationFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ReligiousEventForm>(EMPTY_FORM);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<ReligiousEvent[]>(
        "/religious-events/"
      );

      setEvents(data);
    } catch (err) {
      console.error(
        "Erreur chargement des événements religieux :",
        err
      );
      setEvents([]);
      setError(
        "Impossible de charger les événements religieux pour le moment."
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
        const data = await apiGetList<ReligiousEvent[]>(
          "/religious-events/"
        );

        if (!ignore) {
          setEvents(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des événements religieux :",
          err
        );

        if (!ignore) {
          setEvents([]);
          setError(
            "Impossible de charger les événements religieux pour le moment."
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

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events
      .filter((event) => {
        const matchesSearch =
          !query ||
          [
            event.title,
            event.description,
            event.location,
            event.organizer,
            event.start_date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" || event.event_type === typeFilter;

        const matchesStatus =
          statusFilter === "all" || event.status === statusFilter;

        const matchesPublication =
          publicationFilter === "all" ||
          (publicationFilter === "published" && event.is_published) ||
          (publicationFilter === "draft" && !event.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesStatus &&
          matchesPublication
        );
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [
    events,
    search,
    typeFilter,
    statusFilter,
    publicationFilter,
  ]);

  const plannedCount = events.filter(
    (event) => event.status === "planned"
  ).length;

  const ongoingCount = events.filter(
    (event) => event.status === "ongoing"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "completed"
  ).length;

  const publishedCount = events.filter(
    (event) => event.is_published
  ).length;

  function updateForm(
    field: keyof ReligiousEventForm,
    value: string
  ) {
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

  function openEditForm(event: ReligiousEvent) {
    setForm({
      title: event.title,
      event_type: event.event_type,
      description: event.description ?? "",
      location: event.location ?? "",
      start_date: event.start_date,
      end_date: event.end_date ?? "",
      start_time: event.start_time ?? "",
      end_time: event.end_time ?? "",
      organizer: event.organizer ?? "",
      max_participants:
        event.max_participants === null ||
        event.max_participants === undefined
          ? ""
          : String(event.max_participants),
      status: event.status,
    });

    setEditingId(event.id);
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
      event_type: form.event_type,
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
        const updatedEvent = await apiPatch<ReligiousEvent>(
          `/religious-events/${editingId}/`,
          payload
        );

        setEvents((current) =>
          current.map((item) =>
            item.id === editingId
              ? { ...item, ...updatedEvent }
              : item
          )
        );

        setSuccess("Événement modifié avec succès.");
      } else {
        const createdEvent = await apiPost<ReligiousEvent>(
          "/religious-events/",
          payload
        );

        setEvents((current) => [createdEvent, ...current]);
        setSuccess("Événement créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Erreur enregistrement de l'événement :",
        err
      );
      setError(
        editingId
          ? "Impossible de modifier cet événement."
          : "Impossible de créer cet événement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(event: ReligiousEvent) {
    setError("");
    setSuccess("");
    setUpdatingId(event.id);

    const nextIsPublished = !event.is_published;

    try {
      await apiPatch(`/religious-events/${event.id}/`, {
        is_published: nextIsPublished,
      });

      setEvents((current) =>
        current.map((item) =>
          item.id === event.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Événement publié avec succès."
          : "Événement retiré de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de cet événement."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function changeStatus(
    event: ReligiousEvent,
    status: EventStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(event.id);

    try {
      const updatedEvent = await apiPatch<ReligiousEvent>(
        `/religious-events/${event.id}/`,
        {
          status,
        }
      );

      setEvents((current) =>
        current.map((item) =>
          item.id === event.id
            ? { ...item, ...updatedEvent }
            : item
        )
      );

      setSuccess(
        `Événement marqué comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError(
        "Impossible de modifier le statut de cet événement."
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
            Événements religieux
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les événements religieux, célébrations et rendez-vous spirituels.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadEvents}
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
            Nouvel événement
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Planifiés" value={plannedCount} />
        <StatCard title="En cours" value={ongoingCount} />
        <StatCard title="Terminés" value={completedCount} />
        <StatCard title="Publiés" value={publishedCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'événement"
              : "Créer un nouvel événement"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Conférence du mois de Ramadan"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d'événement
              </label>

              <select
                value={form.event_type}
                onChange={(event) =>
                  updateForm("event_type", event.target.value)
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
              placeholder="Exemple : Comité religieux"
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
              placeholder="Exemple : 100"
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Programme, objectifs ou informations pratiques"
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
                  : "Créer l'événement"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_190px_170px_170px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value as "all" | ReligiousEventType
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
              event.target.value as "all" | EventStatus
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
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des événements
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredEvents.length} événement(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun événement trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez un nouvel événement ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Événement</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Lieu</th>
                  <th className="px-6 py-4">Participants</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const isUpdating = updatingId === event.id;

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {event.title}
                        </div>

                        {event.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {event.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {TYPE_LABELS[event.event_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.start_date}
                        {event.end_date &&
                          event.end_date !== event.start_date
                          ? ` → ${event.end_date}`
                          : ""}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.location || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.participant_count ?? 0}
                        {event.max_participants
                          ? ` / ${event.max_participants}`
                          : ""}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[event.status]}`}
                        >
                          {STATUS_LABELS[event.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(event)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              event.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : event.is_published
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