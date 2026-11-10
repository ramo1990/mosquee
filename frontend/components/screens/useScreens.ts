
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  EMPTY_FORM,
  STATUS_LABELS,
  type Screen,
  type ScreenForm,
  type ScreenFormField,
  type ScreenStatus,
} from "./types";

export function useScreens() {
  const [screens, setScreens] = useState<Screen[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ScreenStatus>("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScreenForm>(EMPTY_FORM);

  const loadScreens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Screen[]>("/screens/");
      setScreens(data);
    } catch (err) {
      console.error("Erreur chargement des écrans :", err);
      setScreens([]);
      setError("Impossible de charger les écrans pour le moment.");
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
        const data = await apiGetList<Screen[]>("/screens/");

        if (!ignore) setScreens(data);
      } catch (err) {
        console.error("Erreur chargement des écrans :", err);

        if (!ignore) {
          setScreens([]);
          setError("Impossible de charger les écrans pour le moment.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const availableGroups = useMemo(() => {
    return Array.from(
      new Set(
        screens
          .map((screen) => screen.group)
          .filter((group): group is string => Boolean(group))
      )
    ).sort();
  }, [screens]);

  const filteredScreens = useMemo(() => {
    const query = search.toLowerCase().trim();

    return screens.filter((screen) => {
      const matchesSearch =
        !query ||
        [
          screen.name,
          screen.location,
          screen.group,
          screen.content,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" || screen.status === statusFilter;

      const matchesGroup =
        groupFilter === "all" || screen.group === groupFilter;

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [screens, search, statusFilter, groupFilter]);

  const onlineCount = screens.filter(
    (screen) => screen.status === "online"
  ).length;

  const offlineCount = screens.filter(
    (screen) => screen.status === "offline"
  ).length;

  const maintenanceCount = screens.filter(
    (screen) => screen.status === "maintenance"
  ).length;

  function updateForm(field: ScreenFormField, value: string) {
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

  function openEditForm(screen: Screen) {
    setForm({
      name: screen.name,
      location: screen.location ?? "",
      group: screen.group ?? "",
      content: screen.content ?? "",
      status: screen.status,
    });

    setEditingId(screen.id);
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

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      group: form.group.trim() || undefined,
      content: form.content.trim() || undefined,
      status: form.status,
    };

    try {
      if (editingId !== null) {
        const updatedScreen = await apiPatch<Screen>(
          `/screens/${editingId}/`,
          payload
        );

        setScreens((current) =>
          current.map((screen) =>
            screen.id === editingId
              ? { ...screen, ...updatedScreen }
              : screen
          )
        );

        setSuccess("Écran modifié avec succès.");
      } else {
        const createdScreen = await apiPost<Screen>(
          "/screens/",
          payload
        );

        setScreens((current) => [createdScreen, ...current]);
        setSuccess("Écran créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'écran :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cet écran."
          : "Impossible de créer cet écran."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(screen: Screen, status: ScreenStatus) {
    setError("");
    setSuccess("");
    setUpdatingId(screen.id);

    try {
      const updatedScreen = await apiPatch<Screen>(
        `/screens/${screen.id}/`,
        { status }
      );

      setScreens((current) =>
        current.map((item) =>
          item.id === screen.id
            ? { ...item, ...updatedScreen }
            : item
        )
      );

      setSuccess(
        `Écran marqué comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cet écran.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    screens,
    filteredScreens,
    availableGroups,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    groupFilter,
    setGroupFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    onlineCount,
    offlineCount,
    maintenanceCount,

    loadScreens,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    changeStatus,
  };
}