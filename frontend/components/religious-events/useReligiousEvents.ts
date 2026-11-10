
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  ReligiousEvent,
  ReligiousEventForm,
  ReligiousEventFormField,
  ReligiousEventType,
  EventStatus,
  EventTypeFilter,
  EventStatusFilter,
  PublicationFilter,
  EMPTY_FORM,
  STATUS_LABELS,
} from "./types";

export function useReligiousEvents() {
  const [events, setEvents] = useState<ReligiousEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [publicationFilter, setPublicationFilter] =
    useState<PublicationFilter>("all");

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
      console.error("Erreur chargement des événements religieux :", err);

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
        console.error("Erreur chargement des événements religieux :", err);

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
  }, [events, search, typeFilter, statusFilter, publicationFilter]);

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

  function updateForm(field: ReligiousEventFormField, value: string) {
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
        event.max_participants == null
          ? ""
          : String(event.max_participants),
      status: event.status,
    });

    setEditingId(event.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
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
      if (editingId !== null) {
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

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de l'événement :", err);

      setError(
        editingId !== null
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
      console.error("Erreur modification de la publication :", err);

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
        { status }
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

  return {
    events,
    loading,
    saving,
    updatingId,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    publicationFilter,
    setPublicationFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    filteredEvents,
    plannedCount,
    ongoingCount,
    completedCount,
    publishedCount,

    loadEvents,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
    changeStatus,
  };
}