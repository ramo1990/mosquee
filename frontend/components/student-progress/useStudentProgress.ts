
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Student,
  Classroom,
  StudentProgress,
  ProgressForm,
  EMPTY_FORM,
} from "./types";

export function useStudentProgress() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [progressRecords, setProgressRecords] = useState<StudentProgress[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgressForm>(EMPTY_FORM);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData, progressData] =
        await Promise.all([
          apiGetList<Student[]>("/students/"),
          apiGetList<Classroom[]>("/classrooms/"),
          apiGetList<StudentProgress[]>("/student-progress/"),
        ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);
      setProgressRecords(progressData);
    } catch (err) {
      console.error("Erreur chargement du suivi des élèves :", err);

      setStudents([]);
      setClassrooms([]);
      setProgressRecords([]);

      setError(
        "Impossible de charger le suivi des élèves pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProgress = useMemo(() => {
    const query = search.toLowerCase().trim();

    return progressRecords.filter((record) => {
      const matchesSearch =
        !query ||
        [
          record.student_name,
          record.classroom_name,
          record.appreciation,
          record.strengths,
          record.difficulties,
          record.comments,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesClassroom =
        classroomFilter === "all" ||
        String(record.classroom) === classroomFilter;

      return matchesSearch && matchesClassroom;
    });
  }, [progressRecords, search, classroomFilter]);

  const averageScore = useMemo(() => {
    const scores = progressRecords
      .map((record) => record.average_score)
      .filter(
        (score): score is number => typeof score === "number"
      );

    if (scores.length === 0) return 0;

    return (
      scores.reduce((total, score) => total + score, 0) /
      scores.length
    );
  }, [progressRecords]);

  const studentsWithProgress = progressRecords.length;

  const studentsWithoutProgress = Math.max(
    students.length - progressRecords.length,
    0
  );

  function updateForm(field: keyof ProgressForm, value: string) {
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

  function openEditForm(record: StudentProgress) {
    setForm({
      student: String(record.student),
      average_score:
        record.average_score === null ||
        record.average_score === undefined
          ? ""
          : String(record.average_score),
      appreciation: record.appreciation ?? "",
      strengths: record.strengths ?? "",
      difficulties: record.difficulties ?? "",
      comments: record.comments ?? "",
    });

    setEditingId(record.id);
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
      student: Number(form.student),
      average_score: form.average_score
        ? Number(form.average_score)
        : null,
      appreciation: form.appreciation.trim() || undefined,
      strengths: form.strengths.trim() || undefined,
      difficulties: form.difficulties.trim() || undefined,
      comments: form.comments.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedRecord = await apiPatch<StudentProgress>(
          `/student-progress/${editingId}/`,
          payload
        );

        setProgressRecords((current) =>
          current.map((record) =>
            record.id === editingId
              ? { ...record, ...updatedRecord }
              : record
          )
        );

        setSuccess("Évaluation modifiée avec succès.");
      } else {
        const createdRecord = await apiPost<StudentProgress>(
          "/student-progress/",
          payload
        );

        setProgressRecords((current) => [
          createdRecord,
          ...current,
        ]);

        setSuccess("Évaluation enregistrée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement du suivi :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette évaluation."
          : "Impossible d'enregistrer cette évaluation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProgress(record: StudentProgress) {
    setError("");
    setSuccess("");
    setUpdatingId(record.id);

    try {
      await apiPatch(`/student-progress/${record.id}/`, {
        is_active: false,
      });

      setProgressRecords((current) =>
        current.map((item) =>
          item.id === record.id
            ? { ...item, is_active: false }
            : item
        )
      );

      setSuccess("Évaluation désactivée avec succès.");
    } catch (err) {
      console.error("Erreur désactivation du suivi :", err);

      setError("Impossible de désactiver cette évaluation.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    students,
    classrooms,
    progressRecords,
    filteredProgress,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    classroomFilter,
    setClassroomFilter,

    error,
    setError,
    success,

    showForm,
    editingId,
    form,

    averageScore,
    studentsWithProgress,
    studentsWithoutProgress,

    loadData,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    deleteProgress,
  };
}