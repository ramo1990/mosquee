"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  LearningProgram,
  ProgramForm,
  EMPTY_FORM,
} from "./types";

export function useLearningPrograms() {
  const [programs, setPrograms] = useState<LearningProgram[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);

  // Chargement des programmes
  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<LearningProgram[]>(
        "/learning-programs/"
      );

      setPrograms(data);
    } catch (err) {
      console.error("Erreur chargement des programmes :", err);
      setPrograms([]);
      setError(
        "Impossible de charger les programmes d'apprentissage pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Niveaux disponibles
  const availableLevels = useMemo(() => {
    const levels = new Set<string>();

    programs.forEach((program) => {
      if (program.level) {
        levels.add(program.level);
      }
    });

    return Array.from(levels).sort();
  }, [programs]);

  // Recherche et filtres
  const filteredPrograms = useMemo(() => {
    const query = search.toLowerCase().trim();

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [
          program.title,
          program.level,
          program.description,
          program.objectives,
          program.content,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesLevel =
        levelFilter === "all" || program.level === levelFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && program.is_active) ||
        (statusFilter === "inactive" && !program.is_active);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [programs, search, levelFilter, statusFilter]);

  // Statistiques
  const activeCount = programs.filter(
    (program) => program.is_active
  ).length;

  const inactiveCount = programs.length - activeCount;

  // Gestion du formulaire
  function updateForm(field: keyof ProgramForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Ouvrir la modale de création
  function openCreateModal() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  // Ouvrir la modale de modification
  function openEditModal(program: LearningProgram) {
    setForm({
      title: program.title,
      level: program.level ?? "",
      description: program.description ?? "",
      objectives: program.objectives ?? "",
      content: program.content ?? "",
      duration_weeks:
        program.duration_weeks !== null &&
        program.duration_weeks !== undefined
          ? String(program.duration_weeks)
          : "",
    });

    setEditingId(program.id);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  // Fermer la modale
  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  // Création et modification
  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.duration_weeks &&
      (!Number.isInteger(Number(form.duration_weeks)) ||
        Number(form.duration_weeks) < 1)
    ) {
      setError("La durée doit être un nombre entier supérieur à zéro.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      level: form.level.trim() || undefined,
      description: form.description.trim() || undefined,
      objectives: form.objectives.trim() || undefined,
      content: form.content.trim() || undefined,
      duration_weeks: form.duration_weeks
        ? Number(form.duration_weeks)
        : null,
    };

    try {
      if (editingId !== null) {
        const updatedProgram = await apiPatch<LearningProgram>(
          `/learning-programs/${editingId}/`,
          payload
        );

        setPrograms((current) =>
          current.map((program) =>
            program.id === editingId
              ? { ...program, ...updatedProgram }
              : program
          )
        );

        setSuccess("Programme modifié avec succès.");
      } else {
        const createdProgram = await apiPost<LearningProgram>(
          "/learning-programs/",
          payload
        );

        setPrograms((current) => [createdProgram, ...current]);

        setSuccess("Programme créé avec succès.");
      }

      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      console.error("Erreur enregistrement du programme :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce programme."
          : "Impossible de créer ce programme."
      );
    } finally {
      setSaving(false);
    }
  }

  // Activation / désactivation
  async function toggleStatus(program: LearningProgram) {
    setError("");
    setSuccess("");

    setUpdatingId(program.id);

    const nextIsActive = !program.is_active;

    try {
      await apiPatch(`/learning-programs/${program.id}/`, {
        is_active: nextIsActive,
      });

      setPrograms((current) =>
        current.map((item) =>
          item.id === program.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Programme activé avec succès."
          : "Programme désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ce programme.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    programs,
    loading,
    saving,
    updatingId,

    search,
    setSearch,

    levelFilter,
    setLevelFilter,

    statusFilter,
    setStatusFilter,

    error,
    success,

    showModal,
    editingId,
    form,

    availableLevels,
    filteredPrograms,

    activeCount,
    inactiveCount,

    loadPrograms,
    updateForm,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    toggleStatus,
  };
}