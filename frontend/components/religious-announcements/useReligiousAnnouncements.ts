
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  AnnouncementForm,
  ReligiousAnnouncement,
  AnnouncementType,
  AnnouncementPriority,
  AnnouncementTypeFilter,
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
  EMPTY_FORM,
} from "./types";

export function useReligiousAnnouncements() {
  const [announcements, setAnnouncements] = useState<
    ReligiousAnnouncement[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<AnnouncementTypeFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<AnnouncementPriorityFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<AnnouncementStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);

  // Chargement des annonces
  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<ReligiousAnnouncement[]>(
        "/religious-announcements/"
      );

      setAnnouncements(data);
    } catch (err) {
      console.error("Erreur chargement des annonces :", err);

      setAnnouncements([]);

      setError(
        "Impossible de charger les annonces religieuses pour le moment."
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
        const data = await apiGetList<ReligiousAnnouncement[]>(
          "/religious-announcements/"
        );

        if (!ignore) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Erreur chargement des annonces :", err);

        if (!ignore) {
          setAnnouncements([]);
          setError(
            "Impossible de charger les annonces religieuses pour le moment."
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

  // Filtrage des annonces
  const filteredAnnouncements = useMemo(() => {
    const query = search.toLowerCase().trim();

    return announcements
      .filter((announcement) => {
        const matchesSearch =
          !query ||
          [
            announcement.title,
            announcement.content,
            announcement.start_date,
            announcement.end_date,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesType =
          typeFilter === "all" ||
          announcement.announcement_type === typeFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          announcement.priority === priorityFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" &&
            announcement.is_published) ||
          (statusFilter === "draft" &&
            !announcement.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesPriority &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = a.start_date ?? "";
        const dateB = b.start_date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [
    announcements,
    search,
    typeFilter,
    priorityFilter,
    statusFilter,
  ]);

  // Statistiques
  const publishedCount = announcements.filter(
    (announcement) => announcement.is_published
  ).length;

  const draftCount = announcements.length - publishedCount;

  // Mise à jour du formulaire
  function updateForm(
    field: keyof AnnouncementForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Fermeture du formulaire
  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  // Ouverture création
  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  // Ouverture modification
  function openEditForm(announcement: ReligiousAnnouncement) {
    setForm({
      title: announcement.title,
      announcement_type: announcement.announcement_type,
      content: announcement.content ?? "",
      priority: announcement.priority,
      start_date: announcement.start_date ?? "",
      end_date: announcement.end_date ?? "",
    });

    setEditingId(announcement.id);
    setShowForm(true);

    setError("");
    setSuccess("");
  }

  // Création et modification
  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      announcement_type: form.announcement_type,
      content: form.content.trim() || undefined,
      priority: form.priority,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedAnnouncement =
          await apiPatch<ReligiousAnnouncement>(
            `/religious-announcements/${editingId}/`,
            payload
          );

        setAnnouncements((current) =>
          current.map((announcement) =>
            announcement.id === editingId
              ? { ...announcement, ...updatedAnnouncement }
              : announcement
          )
        );

        setSuccess("Annonce modifiée avec succès.");
      } else {
        const createdAnnouncement =
          await apiPost<ReligiousAnnouncement>(
            "/religious-announcements/",
            payload
          );

        setAnnouncements((current) => [
          createdAnnouncement,
          ...current,
        ]);

        setSuccess("Annonce créée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de l'annonce :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette annonce."
          : "Impossible de créer cette annonce."
      );
    } finally {
      setSaving(false);
    }
  }

  // Publication / dépublication
  async function togglePublication(
    announcement: ReligiousAnnouncement
  ) {
    setError("");
    setSuccess("");

    setUpdatingId(announcement.id);

    const nextIsPublished = !announcement.is_published;

    try {
      await apiPatch(
        `/religious-announcements/${announcement.id}/`,
        {
          is_published: nextIsPublished,
        }
      );

      setAnnouncements((current) =>
        current.map((item) =>
          item.id === announcement.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Annonce publiée avec succès."
          : "Annonce retirée de la publication."
      );
    } catch (err) {
      console.error("Erreur modification publication :", err);

      setError(
        "Impossible de modifier la publication de cette annonce."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    announcements,
    filteredAnnouncements,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    typeFilter,
    setTypeFilter,

    priorityFilter,
    setPriorityFilter,

    statusFilter,
    setStatusFilter,

    error,
    setError,

    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,

    loadAnnouncements,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  };
}