"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Course,
  Teacher,
  Classroom,
  CourseForm,
  EMPTY_FORM,
} from "./types";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesData, teachersData, classroomsData] =
        await Promise.all([
          apiGetList<Course>("/courses/"),
          apiGetList<Teacher>("/users/?role=teacher"),
          apiGetList<Classroom>("/classrooms/"),
        ]);

      setCourses(coursesData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des cours :", err);

      setCourses([]);
      setTeachers([]);
      setClassrooms([]);

      setError("Impossible de charger les cours pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Matières disponibles
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();

    courses.forEach((course) => {
      if (course.subject) {
        subjects.add(course.subject);
      }
    });

    return Array.from(subjects).sort();
  }, [courses]);

  // Filtrage des cours
  const filteredCourses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [
          course.title,
          course.subject,
          course.description,
          course.teacher_name,
          course.classroom_name,
          course.schedule,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesSubject =
        subjectFilter === "all" ||
        course.subject === subjectFilter;

      const matchesTeacher =
        teacherFilter === "all" ||
        String(course.teacher) === teacherFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && course.is_active) ||
        (statusFilter === "inactive" && !course.is_active);

      return (
        matchesSearch &&
        matchesSubject &&
        matchesTeacher &&
        matchesStatus
      );
    });
  }, [
    courses,
    search,
    subjectFilter,
    teacherFilter,
    statusFilter,
  ]);

  // Statistiques
  const activeCount = courses.filter(
    (course) => course.is_active
  ).length;

  const inactiveCount = courses.length - activeCount;

  // Modification du formulaire
  function updateForm(field: keyof CourseForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Ouverture de la modale de création
  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  // Ouverture de la modale de modification
  function openEditModal(course: Course) {
    setEditingId(course.id);

    setForm({
      title: course.title || "",
      subject: course.subject || "",
      description: course.description || "",
      teacher:
        course.teacher != null ? String(course.teacher) : "",
      classroom:
        course.classroom != null ? String(course.classroom) : "",
      schedule: course.schedule || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  }

  // Fermeture de la modale
  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
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
      subject: form.subject.trim() || undefined,
      description: form.description.trim() || undefined,
      teacher: form.teacher ? Number(form.teacher) : null,
      classroom: form.classroom
        ? Number(form.classroom)
        : null,
      schedule: form.schedule.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedCourse = await apiPatch<Course>(
          `/courses/${editingId}/`,
          payload
        );

        setCourses((current) =>
          current.map((course) =>
            course.id === editingId
              ? { ...course, ...updatedCourse }
              : course
          )
        );

        setSuccess("Cours modifié avec succès.");
      } else {
        const createdCourse = await apiPost<Course>(
          "/courses/",
          payload
        );

        setCourses((current) => [
          createdCourse,
          ...current,
        ]);

        setSuccess("Cours créé avec succès.");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Erreur enregistrement du cours :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce cours."
          : "Impossible de créer ce cours."
      );
    } finally {
      setSaving(false);
    }
  }

  // Activation et désactivation
  async function toggleStatus(course: Course) {
    setError("");
    setSuccess("");
    setUpdatingId(course.id);

    const nextIsActive = !course.is_active;

    try {
      await apiPatch(`/courses/${course.id}/`, {
        is_active: nextIsActive,
      });

      setCourses((current) =>
        current.map((item) =>
          item.id === course.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Cours activé avec succès."
          : "Cours désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ce cours.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    courses,
    teachers,
    classrooms,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    subjectFilter,
    setSubjectFilter,

    teacherFilter,
    setTeacherFilter,

    statusFilter,
    setStatusFilter,

    availableSubjects,
    filteredCourses,

    activeCount,
    inactiveCount,

    error,
    success,

    showModal,
    editingId,
    form,

    loadCourses,
    updateForm,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    toggleStatus,
  };
}