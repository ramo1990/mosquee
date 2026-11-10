
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  ReligiousCourse,
  ReligiousCourseForm,
  Teacher,
  Classroom,
  CourseSubject,
  SubjectFilter,
  StatusFilter,
  EMPTY_FORM,
} from "./types";

export function useReligiousCourses() {
  const [courses, setCourses] = useState<ReligiousCourse[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ReligiousCourseForm>(EMPTY_FORM);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesData, teachersData, classroomsData] =
        await Promise.all([
          apiGetList<ReligiousCourse[]>("/religious-courses/"),
          apiGetList<Teacher[]>("/users/?role=teacher"),
          apiGetList<Classroom[]>("/classrooms/"),
        ]);

      setCourses(coursesData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement des cours religieux :", err);

      setCourses([]);
      setTeachers([]);
      setClassrooms([]);

      setError(
        "Impossible de charger les cours religieux pour le moment."
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
        const [coursesData, teachersData, classroomsData] =
          await Promise.all([
            apiGetList<ReligiousCourse[]>("/religious-courses/"),
            apiGetList<Teacher[]>("/users/?role=teacher"),
            apiGetList<Classroom[]>("/classrooms/"),
          ]);

        if (!ignore) {
          setCourses(coursesData);
          setTeachers(teachersData);
          setClassrooms(classroomsData);
        }
      } catch (err) {
        console.error("Erreur chargement des cours religieux :", err);

        if (!ignore) {
          setCourses([]);
          setTeachers([]);
          setClassrooms([]);
          setError(
            "Impossible de charger les cours religieux pour le moment."
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

  const filteredCourses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [
          course.title,
          course.description,
          course.teacher_name,
          course.classroom_name,
          course.schedule,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesSubject =
        subjectFilter === "all" ||
        course.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && course.is_active) ||
        (statusFilter === "inactive" && !course.is_active);

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [courses, search, subjectFilter, statusFilter]);

  const activeCount = courses.filter(
    (course) => course.is_active
  ).length;

  const inactiveCount = courses.length - activeCount;

  function updateForm(
    field: keyof ReligiousCourseForm,
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

  function openEditForm(course: ReligiousCourse) {
    setForm({
      title: course.title,
      subject: course.subject,
      description: course.description ?? "",
      teacher: course.teacher ? String(course.teacher) : "",
      classroom: course.classroom ? String(course.classroom) : "",
      schedule: course.schedule ?? "",
    });

    setEditingId(course.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
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
      subject: form.subject,
      description: form.description.trim() || undefined,
      teacher: form.teacher ? Number(form.teacher) : null,
      classroom: form.classroom ? Number(form.classroom) : null,
      schedule: form.schedule.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedCourse = await apiPatch<ReligiousCourse>(
          `/religious-courses/${editingId}/`,
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
        const createdCourse = await apiPost<ReligiousCourse>(
          "/religious-courses/",
          payload
        );

        setCourses((current) => [createdCourse, ...current]);
        setSuccess("Cours créé avec succès.");
      }

      closeForm();
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

  async function toggleStatus(course: ReligiousCourse) {
    setError("");
    setSuccess("");
    setUpdatingId(course.id);

    const nextIsActive = !course.is_active;

    try {
      await apiPatch(`/religious-courses/${course.id}/`, {
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
    statusFilter,
    setStatusFilter,

    error,
    setError,
    success,

    showForm,
    editingId,
    form,

    filteredCourses,
    activeCount,
    inactiveCount,

    loadCourses,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    toggleStatus,
  };
}