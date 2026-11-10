
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Activity,
  ActivityForm,
  ActivityStatus,
  ActivityType,
  ActivityTypeFilter,
  ActivityStatusFilter,
  ActivityPublicationFilter,
  EMPTY_FORM,
  STATUS_LABELS,
} from "./types";

export default function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<ActivityTypeFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<ActivityStatusFilter>("all");
  const [publicationFilter, setPublicationFilter] =
    useState<ActivityPublicationFilter>("all");

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
      setError("Impossible de charger les activités pour le moment.");
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
          statusFilter === "all" ||
          activity.status === statusFilter;

        const matchesPublication =
          publicationFilter === "all" ||
          (publicationFilter === "published" &&
            activity.is_published) ||
          (publicationFilter === "draft" &&
            !activity.is_published);

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

  const stats = useMemo(
    () => ({
      planned: activities.filter(
        (activity) => activity.status === "planned"
      ).length,

      ongoing: activities.filter(
        (activity) => activity.status === "ongoing"
      ).length,

      completed: activities.filter(
        (activity) => activity.status === "completed"
      ).length,

      published: activities.filter(
        (activity) => activity.is_published
      ).length,
    }),
    [activities]
  );

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
        activity.max_participants == null
          ? ""
          : String(activity.max_participants),
      status: activity.status,
    });

    setEditingId(activity.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
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
      if (editingId !== null) {
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

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de l'activité :", err);

      setError(
        editingId !== null
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
      console.error("Erreur modification de la publication :", err);

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
        { status }
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

  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setPublicationFilter("all");
  }

  return {
    activities,
    filteredActivities,
    stats,

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
    updateForm,

    loadActivities,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
    changeStatus,
    resetFilters,
  };
}