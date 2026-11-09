
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Assignment,
  AssignmentForm,
  AssignmentFormField,
  AssignmentStatusFilter,
  AssignmentTypeFilter,
  Classroom,
  Teacher,
  EMPTY_FORM,
} from "./types";

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<AssignmentTypeFilter>("all");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [statusFilter, setStatusFilter] =
    useState<AssignmentStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AssignmentForm>(EMPTY_FORM);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        assignmentsData,
        teachersData,
        classroomsData,
      ] = await Promise.all([
        apiGetList<Assignment[]>("/assignments/"),
        apiGetList<Teacher[]>("/users/?role=teacher"),
        apiGetList<Classroom[]>("/classrooms/"),
      ]);

      setAssignments(assignmentsData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des devoirs :", err);

      setAssignments([]);
      setTeachers([]);
      setClassrooms([]);

      setError(
        "Impossible de charger les devoirs et évaluations pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const filteredAssignments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !query ||
        [
          assignment.title,
          assignment.description,
          assignment.teacher_name,
          assignment.classroom_name,
          assignment.due_date,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      const matchesType =
        typeFilter === "all" ||
        assignment.assignment_type === typeFilter;

      const matchesClassroom =
        classroomFilter === "all" ||
        String(assignment.classroom) === classroomFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && assignment.is_published) ||
        (statusFilter === "draft" && !assignment.is_published);

      return (
        matchesSearch &&
        matchesType &&
        matchesClassroom &&
        matchesStatus
      );
    });
  }, [
    assignments,
    search,
    typeFilter,
    classroomFilter,
    statusFilter,
  ]);

  const publishedCount = useMemo(
    () =>
      assignments.filter(
        (assignment) => assignment.is_published
      ).length,
    [assignments]
  );

  const draftCount = assignments.length - publishedCount;

  function updateForm(
    field: AssignmentFormField,
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

  function openEditForm(assignment: Assignment) {
    setForm({
      title: assignment.title,
      assignment_type: assignment.assignment_type,
      description: assignment.description ?? "",
      classroom:
        assignment.classroom != null
          ? String(assignment.classroom)
          : "",
      teacher:
        assignment.teacher != null
          ? String(assignment.teacher)
          : "",
      due_date: assignment.due_date ?? "",
      max_score:
        assignment.max_score != null
          ? String(assignment.max_score)
          : "",
    });

    setEditingId(assignment.id);
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

    const payload = {
      title: form.title.trim(),
      assignment_type: form.assignment_type,
      description: form.description.trim() || undefined,
      classroom: form.classroom
        ? Number(form.classroom)
        : null,
      teacher: form.teacher
        ? Number(form.teacher)
        : null,
      due_date: form.due_date || undefined,
      max_score: form.max_score
        ? Number(form.max_score)
        : null,
    };

    try {
      if (editingId !== null) {
        const updatedAssignment = await apiPatch<Assignment>(
          `/assignments/${editingId}/`,
          payload
        );

        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === editingId
              ? { ...assignment, ...updatedAssignment }
              : assignment
          )
        );

        setSuccess(
          "Devoir ou évaluation modifié avec succès."
        );
      } else {
        const createdAssignment = await apiPost<Assignment>(
          "/assignments/",
          payload
        );

        setAssignments((current) => [
          createdAssignment,
          ...current,
        ]);

        setSuccess(
          "Devoir ou évaluation créé avec succès."
        );
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du devoir :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce devoir ou cette évaluation."
          : "Impossible de créer ce devoir ou cette évaluation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(assignment: Assignment) {
    setError("");
    setSuccess("");
    setUpdatingId(assignment.id);

    const nextIsPublished = !assignment.is_published;

    try {
      await apiPatch(`/assignments/${assignment.id}/`, {
        is_published: nextIsPublished,
      });

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? {
                ...item,
                is_published: nextIsPublished,
              }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Devoir publié avec succès."
          : "Devoir retiré de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );

      setError(
        "Impossible de modifier la publication de ce devoir."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    assignments,
    teachers,
    classrooms,
    filteredAssignments,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    classroomFilter,
    setClassroomFilter,
    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,

    loadAssignments,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  };
}