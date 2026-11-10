
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  DisplayPrayerTime,
  DisplayPrayerTimeForm,
  EMPTY_FORM,
  PrayerStatusFilter,
} from "./types";

export default function useDisplayPrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<
    DisplayPrayerTime[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<PrayerStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<DisplayPrayerTimeForm>({
    ...EMPTY_FORM,
    date: new Date().toISOString().slice(0, 10),
  });

  // Chargement des horaires
  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<DisplayPrayerTime[]>(
        "/display-prayer-times/"
      );

      setPrayerTimes(data);
    } catch (err) {
      console.error("Erreur chargement des horaires :", err);

      setPrayerTimes([]);

      setError(
        "Impossible de charger les horaires affichés pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Groupes disponibles
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    prayerTimes.forEach((item) => {
      if (item.screen_group) {
        groups.add(item.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [prayerTimes]);

  // Filtrage
  const filteredPrayerTimes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return prayerTimes
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.date,
            item.screen_group,
            item.notes,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesGroup =
          groupFilter === "all" ||
          item.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && item.is_published) ||
          (statusFilter === "draft" && !item.is_published);

        return (
          matchesSearch &&
          matchesGroup &&
          matchesStatus
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [
    prayerTimes,
    search,
    groupFilter,
    statusFilter,
  ]);

  // Statistiques
  const publishedCount = prayerTimes.filter(
    (item) => item.is_published
  ).length;

  const draftCount = prayerTimes.length - publishedCount;

  const stats = {
    total: prayerTimes.length,
    published: publishedCount,
    drafts: draftCount,
    groups: availableGroups.length,
  };

  // Modification du formulaire
  function updateForm(
    field: keyof DisplayPrayerTimeForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  function openCreateForm() {
    setForm({
      ...EMPTY_FORM,
      date: new Date().toISOString().slice(0, 10),
    });

    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(item: DisplayPrayerTime) {
    setForm({
      date: item.date,
      screen_group: item.screen_group ?? "",
      fajr: item.fajr ?? "",
      dhuhr: item.dhuhr ?? "",
      asr: item.asr ?? "",
      maghrib: item.maghrib ?? "",
      isha: item.isha ?? "",
      fajr_iqama: item.fajr_iqama ?? "",
      dhuhr_iqama: item.dhuhr_iqama ?? "",
      asr_iqama: item.asr_iqama ?? "",
      maghrib_iqama: item.maghrib_iqama ?? "",
      isha_iqama: item.isha_iqama ?? "",
      jumua_time: item.jumua_time ?? "",
      jumua_khutbah_time: item.jumua_khutbah_time ?? "",
      notes: item.notes ?? "",
    });

    setEditingId(item.id);
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
      date: form.date,
      screen_group: form.screen_group.trim() || undefined,
      fajr: form.fajr || undefined,
      dhuhr: form.dhuhr || undefined,
      asr: form.asr || undefined,
      maghrib: form.maghrib || undefined,
      isha: form.isha || undefined,
      fajr_iqama: form.fajr_iqama || undefined,
      dhuhr_iqama: form.dhuhr_iqama || undefined,
      asr_iqama: form.asr_iqama || undefined,
      maghrib_iqama: form.maghrib_iqama || undefined,
      isha_iqama: form.isha_iqama || undefined,
      jumua_time: form.jumua_time || undefined,
      jumua_khutbah_time:
        form.jumua_khutbah_time || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updated = await apiPatch<DisplayPrayerTime>(
          `/display-prayer-times/${editingId}/`,
          payload
        );

        setPrayerTimes((current) =>
          current.map((item) =>
            item.id === editingId
              ? { ...item, ...updated }
              : item
          )
        );

        setSuccess("Horaires modifiés avec succès.");
      } else {
        const created = await apiPost<DisplayPrayerTime>(
          "/display-prayer-times/",
          payload
        );

        setPrayerTimes((current) => [
          created,
          ...current,
        ]);

        setSuccess("Horaires créés avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement des horaires :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ces horaires."
          : "Impossible de créer ces horaires."
      );
    } finally {
      setSaving(false);
    }
  }

  // Publication
  async function togglePublication(
    prayerTime: DisplayPrayerTime
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(prayerTime.id);

    const nextIsPublished = !prayerTime.is_published;

    try {
      await apiPatch(
        `/display-prayer-times/${prayerTime.id}/`,
        {
          is_published: nextIsPublished,
        }
      );

      setPrayerTimes((current) =>
        current.map((item) =>
          item.id === prayerTime.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Horaires publiés avec succès."
          : "Horaires retirés de la publication."
      );
    } catch (err) {
      console.error("Erreur modification publication :", err);

      setError(
        "Impossible de modifier la publication de ces horaires."
      );
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
    prayerTimes,
    filteredPrayerTimes,
    availableGroups,
    stats,

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

    loadPrayerTimes,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
    resetFilters,
  };
}