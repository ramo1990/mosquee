
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Announcement,
  AnnouncementForm,
  AnnouncementType,
  AnnouncementPriority,
  AnnouncementTypeFilter,
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
  EMPTY_FORM,
} from "./types";

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Announcement[]>("/announcements/");
      setAnnouncements(data);
    } catch (err) {
      console.error("Erreur chargement des annonces :", err);
      setAnnouncements([]);
      setError("Impossible de charger les annonces pour le moment.");
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
        const data = await apiGetList<Announcement[]>("/announcements/");

        if (!ignore) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Erreur chargement des annonces :", err);

        if (!ignore) {
          setAnnouncements([]);
          setError("Impossible de charger les annonces pour le moment.");
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
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" ||
          announcement.announcement_type === typeFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          announcement.priority === priorityFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && announcement.is_published) ||
          (statusFilter === "draft" && !announcement.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesPriority &&
          matchesStatus
        );
      })
      .sort((a, b) =>
        (b.start_date ?? "").localeCompare(a.start_date ?? "")
      );
  }, [announcements, search, typeFilter, priorityFilter, statusFilter]);

  const stats = useMemo(() => {
    const published = announcements.filter(
      (item) => item.is_published
    ).length;

    return {
      total: announcements.length,
      published,
      drafts: announcements.length - published,
      screens: announcements.filter(
        (item) => item.display_on_screens
      ).length,
    };
  }, [announcements]);

  function updateForm(
    field: keyof AnnouncementForm,
    value: string | boolean
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

  function openEditForm(announcement: Announcement) {
    setForm({
      title: announcement.title,
      announcement_type: announcement.announcement_type,
      content: announcement.content ?? "",
      priority: announcement.priority,
      start_date: announcement.start_date ?? "",
      end_date: announcement.end_date ?? "",
      display_on_screens: announcement.display_on_screens,
    });

    setEditingId(announcement.id);
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
      announcement_type: form.announcement_type,
      content: form.content.trim() || undefined,
      priority: form.priority,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      display_on_screens: form.display_on_screens,
    };

    try {
      if (editingId !== null) {
        const updated = await apiPatch<Announcement>(
          `/announcements/${editingId}/`,
          payload
        );

        setAnnouncements((current) =>
          current.map((item) =>
            item.id === editingId ? { ...item, ...updated } : item
          )
        );

        setSuccess("Annonce modifiée avec succès.");
      } else {
        const created = await apiPost<Announcement>(
          "/announcements/",
          payload
        );

        setAnnouncements((current) => [created, ...current]);
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

  async function togglePublication(announcement: Announcement) {
    setError("");
    setSuccess("");
    setUpdatingId(announcement.id);

    const nextIsPublished = !announcement.is_published;

    try {
      await apiPatch(`/announcements/${announcement.id}/`, {
        is_published: nextIsPublished,
      });

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
      console.error("Erreur modification de la publication :", err);
      setError("Impossible de modifier la publication de cette annonce.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleScreenDisplay(announcement: Announcement) {
    setError("");
    setSuccess("");
    setUpdatingId(announcement.id);

    const nextDisplay = !announcement.display_on_screens;

    try {
      await apiPatch(`/announcements/${announcement.id}/`, {
        display_on_screens: nextDisplay,
      });

      setAnnouncements((current) =>
        current.map((item) =>
          item.id === announcement.id
            ? { ...item, display_on_screens: nextDisplay }
            : item
        )
      );

      setSuccess(
        nextDisplay
          ? "Annonce affichée sur les écrans."
          : "Annonce retirée des écrans."
      );
    } catch (err) {
      console.error("Erreur modification de l'affichage :", err);
      setError("Impossible de modifier l'affichage de cette annonce.");
    } finally {
      setUpdatingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
  }

  return {
    announcements,
    filteredAnnouncements,
    stats,
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
    success,
    showForm,
    editingId,
    form,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    loadAnnouncements,
    togglePublication,
    toggleScreenDisplay,
    resetFilters,
  };
}