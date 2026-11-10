
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  EMPTY_FORM,
  PrayerTime,
  PrayerTimeForm,
  PrayerStatusFilter,
} from "./types";

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PrayerStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PrayerTimeForm>(EMPTY_FORM);

  // Chargement
  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<PrayerTime[]>("/prayer-times/");
      setPrayerTimes(data);
    } catch (err) {
      console.error("Erreur chargement des horaires :", err);
      setPrayerTimes([]);
      setError(
        "Impossible de charger les horaires de prière pour le moment."
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
        const data = await apiGetList<PrayerTime[]>("/prayer-times/");

        if (!ignore) {
          setPrayerTimes(data);
        }
      } catch (err) {
        console.error("Erreur chargement des horaires :", err);

        if (!ignore) {
          setPrayerTimes([]);
          setError(
            "Impossible de charger les horaires de prière pour le moment."
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

  // Filtres
  const filteredPrayerTimes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return prayerTimes
      .filter((item) => {
        const matchesSearch =
          !query ||
          [item.date, item.notes].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && item.is_active) ||
          (statusFilter === "inactive" && !item.is_active);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [prayerTimes, search, statusFilter]);

  // Statistiques
  const activeCount = prayerTimes.filter(
    (item) => item.is_active
  ).length;

  const inactiveCount = prayerTimes.length - activeCount;

  // Formulaire
  function updateForm(field: keyof PrayerTimeForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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

  function openEditForm(prayerTime: PrayerTime) {
    setForm({
      date: prayerTime.date,
      fajr: prayerTime.fajr ?? "",
      dhuhr: prayerTime.dhuhr ?? "",
      asr: prayerTime.asr ?? "",
      maghrib: prayerTime.maghrib ?? "",
      isha: prayerTime.isha ?? "",
      fajr_iqama: prayerTime.fajr_iqama ?? "",
      dhuhr_iqama: prayerTime.dhuhr_iqama ?? "",
      asr_iqama: prayerTime.asr_iqama ?? "",
      maghrib_iqama: prayerTime.maghrib_iqama ?? "",
      isha_iqama: prayerTime.isha_iqama ?? "",
      jumua_time: prayerTime.jumua_time ?? "",
      jumua_khutbah_time: prayerTime.jumua_khutbah_time ?? "",
      notes: prayerTime.notes ?? "",
    });

    setEditingId(prayerTime.id);
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
      date: form.date,
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
      jumua_khutbah_time: form.jumua_khutbah_time || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updated = await apiPatch<PrayerTime>(
          `/prayer-times/${editingId}/`,
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
        const created = await apiPost<PrayerTime>(
          "/prayer-times/",
          payload
        );

        setPrayerTimes((current) => [created, ...current]);
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

  // Activation / désactivation
  async function toggleStatus(prayerTime: PrayerTime) {
    setError("");
    setSuccess("");
    setUpdatingId(prayerTime.id);

    const nextIsActive = !prayerTime.is_active;

    try {
      await apiPatch(`/prayer-times/${prayerTime.id}/`, {
        is_active: nextIsActive,
      });

      setPrayerTimes((current) =>
        current.map((item) =>
          item.id === prayerTime.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Horaires activés avec succès."
          : "Horaires désactivés avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ces horaires.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    prayerTimes,
    filteredPrayerTimes,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    error,
    setError,
    success,

    showForm,
    editingId,
    form,
    setForm,
    updateForm,

    activeCount,
    inactiveCount,

    loadPrayerTimes,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    toggleStatus,
  };
}