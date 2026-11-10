
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  apiGetList,
  apiPost,
  apiPatch,
} from "@/lib/api";

import {
  EMPTY_FORM,
  type IslamicCalendarEvent,
  type IslamicEventForm,
  type IslamicEventFormField,
  type IslamicEventTypeFilter,
  type StatusFilter,
} from "./types";

export function useIslamicCalendar() {
  const [events, setEvents] = useState<IslamicCalendarEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] =
    useState<IslamicEventTypeFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

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
      console.error(
        "Erreur chargement du calendrier islamique :",
        err
      );

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
        console.error(
          "Erreur chargement du calendrier islamique :",
          err
        );

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
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesType =
          eventTypeFilter === "all" ||
          event.event_type === eventTypeFilter;

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

  const activeCount = events.filter(
    (event) => event.is_active
  ).length;

  const inactiveCount = events.length - activeCount;

  function updateForm(
    field: IslamicEventFormField,
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

  function closeForm() {
    if (saving) return;

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
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
      hijri_date: form.hijri_date.trim() || undefined,
      gregorian_date: form.gregorian_date || undefined,
    };

    try {
      if (editingId !== null) {
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
      console.error(
        "Erreur enregistrement de l'événement :",
        err
      );

      setError(
        editingId !== null
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
      console.error(
        "Erreur modification du statut :",
        err
      );

      setError(
        "Impossible de modifier le statut de cet événement."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    events,
    loading,
    saving,
    updatingId,

    search,
    setSearch,

    eventTypeFilter,
    setEventTypeFilter,

    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    filteredEvents,
    activeCount,
    inactiveCount,

    loadEvents,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    toggleStatus,
  };
}