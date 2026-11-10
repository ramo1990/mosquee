
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  EMPTY_FORM,
  type MediaForm,
  type MediaItem,
  type MediaType,
  type MediaStatusFilter,
} from "./types";

export default function useMedia() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<MediaStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MediaForm>(EMPTY_FORM);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<MediaItem[]>("/media/");
      setMediaItems(data);
    } catch (err) {
      console.error("Erreur chargement des médias :", err);
      setMediaItems([]);
      setError("Impossible de charger les médias pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await apiGetList<MediaItem[]>("/media/");

        if (!ignore) {
          setMediaItems(data);
        }
      } catch (err) {
        console.error("Erreur chargement des médias :", err);

        if (!ignore) {
          setMediaItems([]);
          setError("Impossible de charger les médias pour le moment.");
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

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    mediaItems.forEach((media) => {
      if (media.category) {
        categories.add(media.category);
      }
    });

    return Array.from(categories).sort();
  }, [mediaItems]);

  const filteredMedia = useMemo(() => {
    const query = search.toLowerCase().trim();

    return mediaItems
      .filter((media) => {
        const matchesSearch =
          !query ||
          [
            media.title,
            media.category,
            media.description,
            media.file_url,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" || media.media_type === typeFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          media.category === categoryFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && media.is_published) ||
          (statusFilter === "draft" && !media.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesStatus
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [
    mediaItems,
    search,
    typeFilter,
    categoryFilter,
    statusFilter,
  ]);

  const imageCount = mediaItems.filter(
    (media) => media.media_type === "image"
  ).length;

  const videoCount = mediaItems.filter(
    (media) => media.media_type === "video"
  ).length;

  const publishedCount = mediaItems.filter(
    (media) => media.is_published
  ).length;

  function updateForm(
    field: keyof MediaForm,
    value: string | File | null
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

  function openEditForm(media: MediaItem) {
    setForm({
      title: media.title,
      media_type: media.media_type,
      file_url: media.file_url ?? "",
      file: null,
      category: media.category ?? "",
      description: media.description ?? "",
    });

    setEditingId(media.id);
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

    try {
      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("media_type", form.media_type);

      if (form.file) {
        payload.append("file", form.file);
      } else if (form.file_url.trim()) {
        payload.append("file_url", form.file_url.trim());
      }

      if (form.category.trim()) {
        payload.append("category", form.category.trim());
      }

      if (form.description.trim()) {
        payload.append("description", form.description.trim());
      }

      if (editingId !== null) {
        const updatedMedia = await apiPatch<MediaItem>(
          `/media/${editingId}/`,
          payload
        );

        setMediaItems((current) =>
          current.map((media) =>
            media.id === editingId
              ? { ...media, ...updatedMedia }
              : media
          )
        );

        setSuccess("Média modifié avec succès.");
      } else {
        const createdMedia = await apiPost<MediaItem>(
          "/media/",
          payload
        );

        setMediaItems((current) => [createdMedia, ...current]);
        setSuccess("Média ajouté avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du média :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce média."
          : "Impossible d'ajouter ce média."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(media: MediaItem) {
    setError("");
    setSuccess("");
    setUpdatingId(media.id);

    const nextIsPublished = !media.is_published;

    try {
      await apiPatch(`/media/${media.id}/`, {
        is_published: nextIsPublished,
      });

      setMediaItems((current) =>
        current.map((item) =>
          item.id === media.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Média publié avec succès."
          : "Média retiré de la publication."
      );
    } catch (err) {
      console.error("Erreur modification de la publication :", err);

      setError(
        "Impossible de modifier la publication de ce média."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    mediaItems,
    filteredMedia,
    availableCategories,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,

    error,
    success,
    setError,
    setSuccess,

    showForm,
    editingId,
    form,

    imageCount,
    videoCount,
    publishedCount,

    loadMedia,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  };
}