
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  DisplaySchedule,
  ScheduleForm,
  ScheduleFormField,
  ScheduleStatusFilter,
  EMPTY_FORM,
} from "./types";

export function useDisplaySchedule() {
  const [schedules, setSchedules] = useState<DisplaySchedule[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<ScheduleStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);

  // Chargement des programmations
  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<DisplaySchedule[]>(
        "/display-schedules/"
      );

      setSchedules(data);
    } catch (err) {
      console.error("Erreur chargement de la programmation :", err);

      setSchedules([]);
      setError(
        "Impossible de charger la programmation des affichages pour le moment."
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
        const data = await apiGetList<DisplaySchedule[]>(
          "/display-schedules/"
        );

        if (!ignore) {
          setSchedules(data);
        }
      } catch (err) {
        console.error("Erreur chargement de la programmation :", err);

        if (!ignore) {
          setSchedules([]);
          setError(
            "Impossible de charger la programmation des affichages pour le moment."
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

  // Groupes d'écrans disponibles
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    schedules.forEach((schedule) => {
      if (schedule.screen_group) {
        groups.add(schedule.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [schedules]);

  // Recherche et filtres
  const filteredSchedules = useMemo(() => {
    const query = search.toLowerCase().trim();

    return schedules
      .filter((schedule) => {
        const matchesSearch =
          !query ||
          [
            schedule.title,
            schedule.content,
            schedule.screen_group,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesGroup =
          groupFilter === "all" ||
          schedule.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && schedule.is_active) ||
          (statusFilter === "inactive" && !schedule.is_active);

        return matchesSearch && matchesGroup && matchesStatus;
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }

        return a.start_datetime.localeCompare(b.start_datetime);
      });
  }, [schedules, search, groupFilter, statusFilter]);

  // Statistiques
  const activeCount = schedules.filter(
    (schedule) => schedule.is_active
  ).length;

  const inactiveCount = schedules.length - activeCount;

  // Formulaire
  function updateForm(field: ScheduleFormField, value: string) {
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

  function openEditForm(schedule: DisplaySchedule) {
    setForm({
      title: schedule.title,
      content: schedule.content ?? "",
      screen_group: schedule.screen_group ?? "",
      start_datetime: schedule.start_datetime,
      end_datetime: schedule.end_datetime,
      priority: String(schedule.priority),
    });

    setEditingId(schedule.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
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
      content: form.content.trim() || undefined,
      screen_group: form.screen_group.trim() || undefined,
      start_datetime: form.start_datetime,
      end_datetime: form.end_datetime,
      priority: Number(form.priority),
    };

    try {
      if (editingId !== null) {
        const updatedSchedule = await apiPatch<DisplaySchedule>(
          `/display-schedules/${editingId}/`,
          payload
        );

        setSchedules((current) =>
          current.map((schedule) =>
            schedule.id === editingId
              ? { ...schedule, ...updatedSchedule }
              : schedule
          )
        );

        setSuccess("Programmation modifiée avec succès.");
      } else {
        const createdSchedule = await apiPost<DisplaySchedule>(
          "/display-schedules/",
          payload
        );

        setSchedules((current) => [createdSchedule, ...current]);

        setSuccess("Programmation créée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de la programmation :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette programmation."
          : "Impossible de créer cette programmation."
      );
    } finally {
      setSaving(false);
    }
  }

  // Activation / désactivation
  async function toggleStatus(schedule: DisplaySchedule) {
    setError("");
    setSuccess("");
    setUpdatingId(schedule.id);

    const nextIsActive = !schedule.is_active;

    try {
      await apiPatch(`/display-schedules/${schedule.id}/`, {
        is_active: nextIsActive,
      });

      setSchedules((current) =>
        current.map((item) =>
          item.id === schedule.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Programmation activée avec succès."
          : "Programmation désactivée avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);

      setError(
        "Impossible de modifier le statut de cette programmation."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    schedules,
    filteredSchedules,
    availableGroups,

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
    updateForm,

    activeCount,
    inactiveCount,

    loadSchedules,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    toggleStatus,
  };
}