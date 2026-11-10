
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  CalendarEvent,
  CalendarEventForm,
  CalendarEventFormField,
  CalendarEventType,
  Teacher,
  Classroom,
  EMPTY_FORM,
  getWeekStart,
  formatDate,
  toDatetimeLocal,
} from "./types";

export function useCourseCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );

  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<
    "all" | CalendarEventType
  >("all");

  const [classroomFilter, setClassroomFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CalendarEventForm>(EMPTY_FORM);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [eventsData, teachersData, classroomsData] =
        await Promise.all([
          apiGetList<CalendarEvent[]>("/calendar-events/"),
          apiGetList<Teacher[]>("/users/?role=teacher"),
          apiGetList<Classroom[]>("/classrooms/"),
        ]);

      setEvents(eventsData);
      setTeachers(teachersData);
      setClassrooms(classroomsData);
    } catch (err) {
      console.error("Erreur chargement du calendrier :", err);

      setEvents([]);
      setTeachers([]);
      setClassrooms([]);

      setError("Impossible de charger le calendrier pour le moment.");
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
        const [eventsData, teachersData, classroomsData] =
          await Promise.all([
            apiGetList<CalendarEvent[]>("/calendar-events/"),
            apiGetList<Teacher[]>("/users/?role=teacher"),
            apiGetList<Classroom[]>("/classrooms/"),
          ]);

        if (!ignore) {
          setEvents(eventsData);
          setTeachers(teachersData);
          setClassrooms(classroomsData);
        }
      } catch (err) {
        console.error("Erreur chargement du calendrier :", err);

        if (!ignore) {
          setEvents([]);
          setTeachers([]);
          setClassrooms([]);
          setError("Impossible de charger le calendrier pour le moment.");
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

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, [currentWeekStart]);

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        [
          event.title,
          event.description,
          event.teacher_name,
          event.classroom_name,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesType =
        eventTypeFilter === "all" ||
        event.event_type === eventTypeFilter;

      const matchesClassroom =
        classroomFilter === "all" ||
        String(event.classroom) === classroomFilter;

      return matchesSearch && matchesType && matchesClassroom;
    });
  }, [events, search, eventTypeFilter, classroomFilter]);

  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};

    weekDays.forEach((day) => {
      grouped[formatDate(day)] = [];
    });

    filteredEvents.forEach((event) => {
      const eventDate = event.start_datetime.slice(0, 10);

      if (grouped[eventDate]) {
        grouped[eventDate].push(event);
      }
    });

    Object.values(grouped).forEach((dayEvents) => {
      dayEvents.sort(
        (a, b) =>
          new Date(a.start_datetime).getTime() -
          new Date(b.start_datetime).getTime()
      );
    });

    return grouped;
  }, [filteredEvents, weekDays]);

  const courseCount = events.filter(
    (event) => event.event_type === "course"
  ).length;

  const examCount = events.filter(
    (event) => event.event_type === "exam"
  ).length;

  function updateForm(field: CalendarEventFormField, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm(date?: Date) {
    const start = date ? new Date(date) : new Date();

    if (date) {
      start.setHours(9, 0, 0, 0);
    }

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    setForm({
      ...EMPTY_FORM,
      start_datetime: toDatetimeLocal(start),
      end_datetime: toDatetimeLocal(end),
    });

    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(event: CalendarEvent) {
    setForm({
      title: event.title,
      event_type: event.event_type,
      description: event.description ?? "",
      classroom:
        event.classroom != null ? String(event.classroom) : "",
      teacher:
        event.teacher != null ? String(event.teacher) : "",
      start_datetime: toDatetimeLocal(
        new Date(event.start_datetime)
      ),
      end_datetime: toDatetimeLocal(
        new Date(event.end_datetime)
      ),
    });

    setEditingId(event.id);
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

    if (
      new Date(form.end_datetime).getTime() <=
      new Date(form.start_datetime).getTime()
    ) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      event_type: form.event_type,
      description: form.description.trim() || undefined,
      classroom: form.classroom ? Number(form.classroom) : null,
      teacher: form.teacher ? Number(form.teacher) : null,
      start_datetime: form.start_datetime,
      end_datetime: form.end_datetime,
    };

    try {
      if (editingId !== null) {
        const updatedEvent = await apiPatch<CalendarEvent>(
          `/calendar-events/${editingId}/`,
          payload
        );

        setEvents((current) =>
          current.map((item) =>
            item.id === editingId
              ? { ...item, ...updatedEvent }
              : item
          )
        );

        setSuccess("Événement modifié avec succès.");
      } else {
        const createdEvent = await apiPost<CalendarEvent>(
          "/calendar-events/",
          payload
        );

        setEvents((current) => [createdEvent, ...current]);

        setSuccess("Événement créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'événement :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cet événement."
          : "Impossible de créer cet événement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(event: CalendarEvent) {
    setError("");
    setSuccess("");
    setUpdatingId(event.id);

    try {
      await apiPatch(`/calendar-events/${event.id}/`, {
        is_active: false,
      });

      setEvents((current) =>
        current.filter((item) => item.id !== event.id)
      );

      setSuccess("Événement supprimé du calendrier.");
    } catch (err) {
      console.error("Erreur suppression de l'événement :", err);
      setError("Impossible de supprimer cet événement.");
    } finally {
      setUpdatingId(null);
    }
  }

  function changeWeek(direction: -1 | 1) {
    setCurrentWeekStart((current) => {
      const nextDate = new Date(current);
      nextDate.setDate(nextDate.getDate() + direction * 7);

      return getWeekStart(nextDate);
    });
  }

  return {
    events,
    teachers,
    classrooms,
    filteredEvents,
    weekDays,
    eventsByDay,

    loading,
    saving,
    updatingId,

    currentWeekStart,
    search,
    setSearch,
    eventTypeFilter,
    setEventTypeFilter,
    classroomFilter,
    setClassroomFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    courseCount,
    examCount,

    loadEvents,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    deleteEvent,
    changeWeek,
  };
}