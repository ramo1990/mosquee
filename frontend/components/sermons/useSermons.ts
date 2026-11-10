
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Sermon,
  Imam,
  SermonForm,
  SermonFormField,
  SermonType,
  SermonStatusFilter,
  EMPTY_FORM,
} from "./types";

export function useSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [imams, setImams] = useState<Imam[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<"all" | SermonType>("all");

  const [imamFilter, setImamFilter] = useState("all");

  const [statusFilter, setStatusFilter] =
    useState<SermonStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SermonForm>(EMPTY_FORM);

  const loadSermons = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [sermonsData, imamsData] = await Promise.all([
        apiGetList<Sermon[]>("/sermons/"),
        apiGetList<Imam[]>("/users/?role=imam"),
      ]);

      setSermons(sermonsData);
      setImams(imamsData);
    } catch (err) {
      console.error("Erreur chargement des sermons :", err);

      setSermons([]);
      setImams([]);

      setError("Impossible de charger les sermons pour le moment.");
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
        const [sermonsData, imamsData] = await Promise.all([
          apiGetList<Sermon[]>("/sermons/"),
          apiGetList<Imam[]>("/users/?role=imam"),
        ]);

        if (!ignore) {
          setSermons(sermonsData);
          setImams(imamsData);
        }
      } catch (err) {
        console.error("Erreur chargement des sermons :", err);

        if (!ignore) {
          setSermons([]);
          setImams([]);
          setError("Impossible de charger les sermons pour le moment.");
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

  const filteredSermons = useMemo(() => {
    const query = search.toLowerCase().trim();

    return sermons
      .filter((sermon) => {
        const matchesSearch =
          !query ||
          [
            sermon.title,
            sermon.content,
            sermon.imam_name,
            sermon.date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" ||
          sermon.sermon_type === typeFilter;

        const matchesImam =
          imamFilter === "all" ||
          String(sermon.imam) === imamFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && sermon.is_published) ||
          (statusFilter === "draft" && !sermon.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesImam &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = a.date ?? "";
        const dateB = b.date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [
    sermons,
    search,
    typeFilter,
    imamFilter,
    statusFilter,
  ]);

  const publishedCount = sermons.filter(
    (sermon) => sermon.is_published
  ).length;

  const draftCount = sermons.length - publishedCount;

  function updateForm(
    field: SermonFormField,
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

  function openEditForm(sermon: Sermon) {
    setForm({
      title: sermon.title,
      sermon_type: sermon.sermon_type,
      content: sermon.content ?? "",
      imam: sermon.imam ? String(sermon.imam) : "",
      date: sermon.date ?? "",
      video_url: sermon.video_url ?? "",
      audio_url: sermon.audio_url ?? "",
    });

    setEditingId(sermon.id);
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
      sermon_type: form.sermon_type,
      content: form.content.trim() || undefined,
      imam: form.imam ? Number(form.imam) : null,
      date: form.date || undefined,
      video_url: form.video_url.trim() || undefined,
      audio_url: form.audio_url.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedSermon = await apiPatch<Sermon>(
          `/sermons/${editingId}/`,
          payload
        );

        setSermons((current) =>
          current.map((sermon) =>
            sermon.id === editingId
              ? { ...sermon, ...updatedSermon }
              : sermon
          )
        );

        setSuccess("Sermon modifié avec succès.");
      } else {
        const createdSermon = await apiPost<Sermon>(
          "/sermons/",
          payload
        );

        setSermons((current) => [
          createdSermon,
          ...current,
        ]);

        setSuccess("Sermon créé avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement du sermon :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce sermon."
          : "Impossible de créer ce sermon."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(sermon: Sermon) {
    setError("");
    setSuccess("");
    setUpdatingId(sermon.id);

    const nextIsPublished = !sermon.is_published;

    try {
      await apiPatch(`/sermons/${sermon.id}/`, {
        is_published: nextIsPublished,
      });

      setSermons((current) =>
        current.map((item) =>
          item.id === sermon.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Sermon publié avec succès."
          : "Sermon retiré de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );

      setError(
        "Impossible de modifier la publication de ce sermon."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    sermons,
    imams,
    filteredSermons,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    typeFilter,
    setTypeFilter,

    imamFilter,
    setImamFilter,

    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,

    loadSermons,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  };
}