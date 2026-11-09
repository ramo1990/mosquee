"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type IslamicEventType =
  | "ramadan"
  | "eid"
  | "ashura"
  | "mawlid"
  | "isra_miraj"
  | "other";

type IslamicCalendarEvent = {
  id: number;
  title: string;
  event_type: IslamicEventType;
  description?: string;
  hijri_date?: string;
  gregorian_date?: string;
  is_active: boolean;
};

type IslamicEventForm = {
  title: string;
  event_type: IslamicEventType;
  description: string;
  hijri_date: string;
  gregorian_date: string;
};

const EMPTY_FORM: IslamicEventForm = {
  title: "",
  event_type: "other",
  description: "",
  hijri_date: "",
  gregorian_date: "",
};

const EVENT_TYPE_LABELS: Record<IslamicEventType, string> = {
  ramadan: "Ramadan",
  eid: "Aïd",
  ashura: "Achoura",
  mawlid: "Mawlid",
  isra_miraj: "Isra et Miraj",
  other: "Autre",
};

const EVENT_TYPE_OPTIONS: IslamicEventType[] = [
  "ramadan",
  "eid",
  "ashura",
  "mawlid",
  "isra_miraj",
  "other",
];

export default function IslamicCalendarManagement() {
  const [events, setEvents] = useState<IslamicCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<
    "all" | IslamicEventType
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<IslamicEventForm>(EMPTY_FORM);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<IslamicCalendarEvent[]>(
        "/islamic-calendar/"
      );

      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement du calendrier islamique :", err);
      setEvents([]);
      setError(
        "Impossible de charger le calendrier islamique pour le moment."
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
        const data = await apiGetList<IslamicCalendarEvent[]>(
          "/islamic-calendar/"
        );

        if (!ignore) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Erreur chargement du calendrier islamique :", err);

        if (!ignore) {
          setEvents([]);
          setError(
            "Impossible de charger le calendrier islamique pour le moment."
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
            event.hijri_date,
            event.gregorian_date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          eventTypeFilter === "all" || event.event_type === eventTypeFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && event.is_active) ||
          (statusFilter === "inactive" && !event.is_active);

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.gregorian_date ?? "";
        const dateB = b.gregorian_date ?? "";

        return dateA.localeCompare(dateB);
      });
  }, [events, search, eventTypeFilter, statusFilter]);

  const activeCount = events.filter((event) => event.is_active).length;
  const inactiveCount = events.length - activeCount;

  function updateForm(field: keyof IslamicEventForm, value: string) {
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

  function openEditForm(event: IslamicCalendarEvent) {
    setForm({
      title: event.title,
      event_type: event.event_type,
      description: event.description ?? "",
      hijri_date: event.hijri_date ?? "",
      gregorian_date: event.gregorian_date ?? "",
    });

    setEditingId(event.id);
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
      event_type: form.event_type,
      description: form.description.trim() || undefined,
      hijri_date: form.hijri_date.trim() || undefined,
      gregorian_date: form.gregorian_date || undefined,
    };

    try {
      if (editingId) {
        const updatedEvent = await apiPatch<IslamicCalendarEvent>(
          `/islamic-calendar/${editingId}/`,
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
        const createdEvent = await apiPost<IslamicCalendarEvent>(
          "/islamic-calendar/",
          payload
        );

        setEvents((current) => [createdEvent, ...current]);
        setSuccess("Événement créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'événement :", err);
      setError(
        editingId
          ? "Impossible de modifier cet événement."
          : "Impossible de créer cet événement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(event: IslamicCalendarEvent) {
    setError("");
    setSuccess("");
    setUpdatingId(event.id);

    const nextIsActive = !event.is_active;

    try {
      await apiPatch(`/islamic-calendar/${event.id}/`, {
        is_active: nextIsActive,
      });

      setEvents((current) =>
        current.map((item) =>
          item.id === event.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Événement activé avec succès."
          : "Événement désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cet événement.");
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
            Calendrier islamique
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les dates importantes du calendrier hégirien et les événements religieux.
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
            Ajouter un événement
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total événements" value={events.length} />
        <StatCard title="Événements actifs" value={activeCount} />
        <StatCard title="Événements inactifs" value={inactiveCount} />
        <StatCard
          title="Types d'événements"
          value={EVENT_TYPE_OPTIONS.length}
        />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'événement"
              : "Ajouter un événement religieux"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Aïd al-Fitr"
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
                {EVENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Date hégirienne"
              value={form.hijri_date}
              onChange={(value) => updateForm("hijri_date", value)}
              placeholder="Exemple : 1 Shawwal 1447"
            />

            <FormField
              label="Date grégorienne"
              type="date"
              value={form.gregorian_date}
              onChange={(value) => updateForm("gregorian_date", value)}
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Signification, pratiques ou précisions"
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
                  : "Ajouter l'événement"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={eventTypeFilter}
          onChange={(event) =>
            setEventTypeFilter(
              event.target.value as "all" | IslamicEventType
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>

          {EVENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABELS[type]}
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
            Événements religieux
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
              Ajoutez un événement ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Événement</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date hégirienne</th>
                  <th className="px-6 py-4">Date grégorienne</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const isUpdating = updatingId === event.id;

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
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
                          {EVENT_TYPE_LABELS[event.event_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.hijri_date || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.gregorian_date || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            event.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {event.is_active ? "Actif" : "Inactif"}
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
                            onClick={() => toggleStatus(event)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              event.is_active
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : event.is_active
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