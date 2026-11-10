import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Student,
  Classroom,
  StudentForm,
  EMPTY_FORM,
} from "./types";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [classroomFilter, setClassroomFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);

  // Chargement des élèves et des classes
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsData, classroomsData] = await Promise.all([
        apiGetList<Student>("/students/"),
        apiGetList<Classroom>("/classrooms/"),
      ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des élèves :", err);

      setStudents([]);
      setClassrooms([]);

      setError(
        "Impossible de charger les élèves pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Filtrage des élèves
  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.first_name,
          student.last_name,
          student.username,
          student.email,
          student.phone,
          student.classroom_name,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && student.is_active) ||
        (statusFilter === "inactive" && !student.is_active);

      const matchesClassroom =
        classroomFilter === "all" ||
        String(student.classroom) === classroomFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClassroom
      );
    });
  }, [students, search, statusFilter, classroomFilter]);

  // Statistiques
  const activeCount = students.filter(
    (student) => student.is_active
  ).length;

  const inactiveCount = students.length - activeCount;

  // Gestion du formulaire
  function updateForm(field: keyof StudentForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function closeModal() {
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  // Inscription d'un élève
  async function createStudent(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        birth_date: form.birth_date || undefined,
        classroom: form.classroom
          ? Number(form.classroom)
          : null,
      };

      const createdStudent = await apiPost<Student>(
        "/students/",
        payload
      );

      setStudents((current) => [
        createdStudent,
        ...current,
      ]);

      setSuccess("Élève inscrit avec succès.");

      closeModal();
    } catch (err) {
      console.error("Erreur inscription de l'élève :", err);

      setError(
        "Impossible d'inscrire cet élève. Vérifiez les informations saisies."
      );
    } finally {
      setCreating(false);
    }
  }

  // Activation / désactivation
  async function toggleStatus(student: Student) {
    setError("");
    setSuccess("");
    setUpdatingId(student.id);

    const nextIsActive = !student.is_active;

    try {
      await apiPatch(`/students/${student.id}/`, {
        is_active: nextIsActive,
      });

      setStudents((current) =>
        current.map((item) =>
          item.id === student.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Élève activé avec succès."
          : "Élève désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);

      setError(
        "Impossible de modifier le statut de cet élève."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    students,
    classrooms,
    loading,
    creating,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    classroomFilter,
    setClassroomFilter,

    error,
    success,

    showModal,
    form,

    filteredStudents,
    activeCount,
    inactiveCount,

    loadStudents,
    updateForm,
    openCreateModal,
    closeModal,
    createStudent,
    toggleStatus,
  };
}