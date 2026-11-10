
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Slide,
  SlideForm,
  EMPTY_FORM,
  SlideStats,
} from "./types";

export default function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SlideForm>(EMPTY_FORM);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Slide[]>("/slides/");
      setSlides(data);
    } catch (err) {
      console.error("Erreur chargement des diapositives :", err);
      setSlides([]);
      setError("Impossible de charger les diapositives pour le moment.");
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
        const data = await apiGetList<Slide[]>("/slides/");

        if (!ignore) {
          setSlides(data);
        }
      } catch (err) {
        console.error("Erreur chargement des diapositives :", err);

        if (!ignore) {
          setSlides([]);
          setError("Impossible de charger les diapositives pour le moment.");
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

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    slides.forEach((slide) => {
      if (slide.screen_group) {
        groups.add(slide.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [slides]);

  const filteredSlides = useMemo(() => {
    const query = search.toLowerCase().trim();

    return slides
      .filter((slide) => {
        const matchesSearch =
          !query ||
          [slide.title, slide.content, slide.screen_group].some(
            (value) => value?.toLowerCase().includes(query)
          );

        const matchesGroup =
          groupFilter === "all" ||
          slide.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && slide.is_published) ||
          (statusFilter === "draft" && !slide.is_published);

        return matchesSearch && matchesGroup && matchesStatus;
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [slides, search, groupFilter, statusFilter]);

  const stats: SlideStats = {
    total: slides.length,
    published: slides.filter((slide) => slide.is_published).length,
    drafts: slides.filter((slide) => !slide.is_published).length,
    groups: availableGroups.length,
  };

  function updateForm(field: keyof SlideForm, value: string) {
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

  function openEditForm(slide: Slide) {
    setForm({
      title: slide.title,
      content: slide.content ?? "",
      image_url: slide.image_url ?? "",
      video_url: slide.video_url ?? "",
      screen_group: slide.screen_group ?? "",
      display_order: String(slide.display_order),
      duration_seconds: String(slide.duration_seconds),
    });

    setEditingId(slide.id);
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

    const displayOrder = Number(form.display_order);
    const durationSeconds = Number(form.duration_seconds);

    if (
      !Number.isInteger(displayOrder) ||
      displayOrder < 1 ||
      !Number.isInteger(durationSeconds) ||
      durationSeconds < 1
    ) {
      setError("L'ordre et la durée doivent être des nombres entiers positifs.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      video_url: form.video_url.trim() || undefined,
      screen_group: form.screen_group.trim() || undefined,
      display_order: displayOrder,
      duration_seconds: durationSeconds,
    };

    try {
      if (editingId !== null) {
        const updatedSlide = await apiPatch<Slide>(
          `/slides/${editingId}/`,
          payload
        );

        setSlides((current) =>
          current.map((slide) =>
            slide.id === editingId
              ? { ...slide, ...updatedSlide }
              : slide
          )
        );

        setSuccess("Diapositive modifiée avec succès.");
      } else {
        const createdSlide = await apiPost<Slide>(
          "/slides/",
          payload
        );

        setSlides((current) => [...current, createdSlide]);
        setSuccess("Diapositive créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la diapositive :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette diapositive."
          : "Impossible de créer cette diapositive."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(slide: Slide) {
    setError("");
    setSuccess("");
    setUpdatingId(slide.id);

    const nextIsPublished = !slide.is_published;

    try {
      await apiPatch(`/slides/${slide.id}/`, {
        is_published: nextIsPublished,
      });

      setSlides((current) =>
        current.map((item) =>
          item.id === slide.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Diapositive publiée avec succès."
          : "Diapositive retirée de la publication."
      );
    } catch (err) {
      console.error("Erreur modification de la publication :", err);
      setError("Impossible de modifier la publication de cette diapositive.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function moveSlide(slide: Slide, direction: -1 | 1) {
    setError("");
    setSuccess("");

    const orderedSlides = [...slides].sort(
      (a, b) => a.display_order - b.display_order
    );

    const currentIndex = orderedSlides.findIndex(
      (item) => item.id === slide.id
    );

    const targetIndex = currentIndex + direction;

    if (currentIndex === -1 || targetIndex < 0 || targetIndex >= orderedSlides.length) {
      return;
    }

    const targetSlide = orderedSlides[targetIndex];

    if (updatingId !== null) return;

    setUpdatingId(slide.id);

    try {
      await apiPatch(`/slides/${slide.id}/`, {
        display_order: targetSlide.display_order,
      });

      await apiPatch(`/slides/${targetSlide.id}/`, {
        display_order: slide.display_order,
      });

      setSlides((current) =>
        current.map((item) => {
          if (item.id === slide.id) {
            return { ...item, display_order: targetSlide.display_order };
          }

          if (item.id === targetSlide.id) {
            return { ...item, display_order: slide.display_order };
          }

          return item;
        })
      );

      setSuccess("Ordre d’affichage modifié.");
    } catch (err) {
      console.error("Erreur modification de l'ordre :", err);

      setError("Impossible de modifier l'ordre des diapositives.");
      await loadSlides();
    } finally {
      setUpdatingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setGroupFilter("all");
    setStatusFilter("all");
  }

  return {
    slides,
    loading,
    saving,
    updatingId,

    search,
    setSearch,
    groupFilter,
    setGroupFilter,
    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    stats,
    availableGroups,
    filteredSlides,

    loadSlides,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
    moveSlide,
    resetFilters,
  };
}