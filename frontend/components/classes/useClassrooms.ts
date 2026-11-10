
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Classroom,
  ClassroomForm,
  ClassroomStatusFilter,
  EMPTY_FORM,
} from "./classroom.types";

export function useClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ClassroomStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<ClassroomForm>(EMPTY_FORM);

  // Chargement des classes
  const loadClassrooms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Classroom>("/classrooms/");
      setClassrooms(data);
    } catch (err) {
      console.error("Erreur chargement des classes :", err);
      setClassrooms([]);
      setError("Impossible de charger les classes pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClassrooms();
  }, [loadClassrooms]);

  // Recherche et filtres
  const filteredClassrooms = useMemo(() => {
    const query = search.toLowerCase().trim();

    return classrooms.filter((classroom) => {
      const matchesSearch =
        !query ||
        [
          classroom.name,
          classroom.level,
          classroom.description,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && classroom.is_active) ||
        (statusFilter === "inactive" && !classroom.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [classrooms, search, statusFilter]);

  // Statistiques
  const activeCount = classrooms.filter(
    (classroom) => classroom.is_active
  ).length;

  const inactiveCount = classrooms.length - activeCount;

  const totalStudents = classrooms.reduce(
    (total, classroom) => total + (classroom.student_count ?? 0),
    0
  );

  // Mise à jour du formulaire
  function updateForm(field: keyof ClassroomForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Ouverture de la modale de création
  function openCreateModal() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  // Ouverture de la modale de modification
  function openEditModal(classroom: Classroom) {
    setForm({
      name: classroom.name,
      level: classroom.level ?? "",
      description: classroom.description ?? "",
    });

    setEditingId(classroom.id);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  // Fermeture de la modale
  function closeModal() {
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  // Création ou modification
  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      level: form.level.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedClassroom = await apiPatch<Classroom>(
          `/classrooms/${editingId}/`,
          payload
        );

        setClassrooms((current) =>
          current.map((classroom) =>
            classroom.id === editingId
              ? { ...classroom, ...updatedClassroom }
              : classroom
          )
        );

        setSuccess("Classe modifiée avec succès.");
      } else {
        const createdClassroom = await apiPost<Classroom>(
          "/classrooms/",
          payload
        );

        setClassrooms((current) => [
          createdClassroom,
          ...current,
        ]);

        setSuccess("Classe créée avec succès.");
      }

      closeModal();
    } catch (err) {
      console.error("Erreur enregistrement de la classe :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette classe."
          : "Impossible de créer cette classe."
      );
    } finally {
      setSaving(false);
    }
  }

  // Activation / désactivation
  async function toggleStatus(classroom: Classroom) {
    setError("");
    setSuccess("");
    setUpdatingId(classroom.id);

    const nextIsActive = !classroom.is_active;

    try {
      await apiPatch(`/classrooms/${classroom.id}/`, {
        is_active: nextIsActive,
      });

      setClassrooms((current) =>
        current.map((item) =>
          item.id === classroom.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Classe activée avec succès."
          : "Classe désactivée avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cette classe.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    classrooms,
    filteredClassrooms,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    error,
    success,

    modalOpen,
    editingId,
    form,

    activeCount,
    inactiveCount,
    totalStudents,

    loadClassrooms,
    updateForm,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    toggleStatus,
  };
}
