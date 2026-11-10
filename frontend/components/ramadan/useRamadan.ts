
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  RamadanDay,
  RamadanDayForm,
  RamadanFormField,
  RamadanPublicationFilter,
  EMPTY_FORM,
} from "./types";

export function useRamadan() {
  const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [publicationFilter, setPublicationFilter] =
    useState<RamadanPublicationFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RamadanDayForm>(EMPTY_FORM);

  const loadRamadanDays = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<RamadanDay[]>("/ramadan-days/");
      setRamadanDays(data);
    } catch (err) {
      console.error("Erreur chargement du programme Ramadan :", err);

      setRamadanDays([]);
      setError(
        "Impossible de charger le programme Ramadan pour le moment."
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
        const data = await apiGetList<RamadanDay[]>("/ramadan-days/");

        if (!ignore) {
          setRamadanDays(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement du programme Ramadan :",
          err
        );

        if (!ignore) {
          setRamadanDays([]);
          setError(
            "Impossible de charger le programme Ramadan pour le moment."
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

  const filteredDays = useMemo(() => {
    const query = search.toLowerCase().trim();

    return ramadanDays
      .filter((day) => {
        const matchesSearch =
          !query ||
          [
            String(day.day_number),
            day.date,
            day.activity,
            day.notes,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesPublication =
          publicationFilter === "all" ||
          (publicationFilter === "published" && day.is_published) ||
          (publicationFilter === "draft" && !day.is_published);

        return matchesSearch && matchesPublication;
      })
      .sort((a, b) => a.day_number - b.day_number);
  }, [ramadanDays, search, publicationFilter]);

  const publishedCount = ramadanDays.filter(
    (day) => day.is_published
  ).length;

  const draftCount = ramadanDays.length - publishedCount;

  const activityCount = ramadanDays.filter(
    (day) => day.activity
  ).length;

  function updateForm(field: RamadanFormField, value: string) {
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

  function openEditForm(day: RamadanDay) {
    setForm({
      day_number: String(day.day_number),
      date: day.date,
      suhoor_end_time: day.suhoor_end_time ?? "",
      iftar_time: day.iftar_time ?? "",
      tarawih_time: day.tarawih_time ?? "",
      activity: day.activity ?? "",
      notes: day.notes ?? "",
    });

    setEditingId(day.id);
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
      day_number: Number(form.day_number),
      date: form.date,
      suhoor_end_time: form.suhoor_end_time || undefined,
      iftar_time: form.iftar_time || undefined,
      tarawih_time: form.tarawih_time || undefined,
      activity: form.activity.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedDay = await apiPatch<RamadanDay>(
          `/ramadan-days/${editingId}/`,
          payload
        );

        setRamadanDays((current) =>
          current.map((day) =>
            day.id === editingId
              ? { ...day, ...updatedDay }
              : day
          )
        );

        setSuccess("Journée modifiée avec succès.");
      } else {
        const createdDay = await apiPost<RamadanDay>(
          "/ramadan-days/",
          payload
        );

        setRamadanDays((current) => [
          ...current,
          createdDay,
        ]);

        setSuccess("Journée ajoutée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de la journée :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette journée."
          : "Impossible d'ajouter cette journée."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(day: RamadanDay) {
    setError("");
    setSuccess("");
    setUpdatingId(day.id);

    const nextIsPublished = !day.is_published;

    try {
      await apiPatch(`/ramadan-days/${day.id}/`, {
        is_published: nextIsPublished,
      });

      setRamadanDays((current) =>
        current.map((item) =>
          item.id === day.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Journée publiée avec succès."
          : "Journée retirée de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );

      setError(
        "Impossible de modifier la publication de cette journée."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    ramadanDays,
    filteredDays,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    publicationFilter,
    setPublicationFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,
    activityCount,

    loadRamadanDays,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  };
}