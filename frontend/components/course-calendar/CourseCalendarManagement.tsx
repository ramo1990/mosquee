"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type CalendarEventType = "course" | "exam" | "activity" | "meeting";

type CalendarEvent = {
  id: number;
  title: string;
  event_type: CalendarEventType;
  description?: string;
  classroom?: number | null;
  classroom_name?: string;
  teacher?: number | null;
  teacher_name?: string;
  start_datetime: string;
  end_datetime: string;
};

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type Classroom = {
  id: number;
  name: string;
};

type CalendarEventForm = {
  title: string;
  event_type: CalendarEventType;
  description: string;
  classroom: string;
  teacher: string;
  start_datetime: string;
  end_datetime: string;
};

const EMPTY_FORM: CalendarEventForm = {
  title: "",
  event_type: "course",
  description: "",
  classroom: "",
  teacher: "",
  start_datetime: "",
  end_datetime: "",
};

const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  course: "Cours",
  exam: "Évaluation",
  activity: "Activité",
  meeting: "Réunion",
};

const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  course: "bg-emerald-100 text-emerald-800 border-emerald-200",
  exam: "bg-red-100 text-red-700 border-red-200",
  activity: "bg-blue-100 text-blue-800 border-blue-200",
  meeting: "bg-amber-100 text-amber-800 border-amber-200",
};

const EVENT_TYPE_OPTIONS: CalendarEventType[] = [
  "course",
  "exam",
  "activity",
  "meeting",
];

const WEEK_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function getWeekStart(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CourseCalendarManagement() {
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
      const [eventsData, teachersData, classroomsData] = await Promise.all([
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
        const [eventsData, teachersData, classroomsData] = await Promise.all([
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

      date.setDate(currentWeekStart.getDate() + index);

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
        eventTypeFilter === "all" || event.event_type === eventTypeFilter;

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

    return grouped;
  }, [filteredEvents, weekDays]);

  const courseCount = events.filter(
    (event) => event.event_type === "course"
  ).length;

  const examCount = events.filter(
    (event) => event.event_type === "exam"
  ).length;

  function updateForm(field: keyof CalendarEventForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm(date?: Date) {
    const start = date ?? new Date();
    const end = new Date(start);

    end.setHours(start.getHours() + 1);

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
      classroom: event.classroom ? String(event.classroom) : "",
      teacher: event.teacher ? String(event.teacher) : "",
      start_datetime: toDatetimeLocal(new Date(event.start_datetime)),
      end_datetime: toDatetimeLocal(new Date(event.end_datetime)),
    });

    setEditingId(event.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function toDatetimeLocal(date: Date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
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
      if (editingId) {
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
        editingId
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

      nextDate.setDate(current.getDate() + direction * 7);

      return getWeekStart(nextDate);
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Calendrier des cours
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et planifiez les séances, horaires et événements pédagogiques.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadEvents}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={() => openCreateForm()}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle séance
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Événements" value={events.length} />
        <StatCard title="Cours" value={courseCount} />
        <StatCard title="Évaluations" value={examCount} />
        <StatCard title="Classes" value={classrooms.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'événement"
              : "Créer un nouvel événement"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Cours de Coran - Classe A"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d'événement
              </label>

              <select
                value={form.event_type}
                onChange={(event) =>
                  updateForm("event_type", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {EVENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Classe
              </label>

              <select
                value={form.classroom}
                onChange={(event) =>
                  updateForm("classroom", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non affectée</option>

                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Enseignant
              </label>

              <select
                value={form.teacher}
                onChange={(event) =>
                  updateForm("teacher", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non attribué</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Début"
              type="datetime-local"
              value={form.start_datetime}
              onChange={(value) => updateForm("start_datetime", value)}
              required
            />

            <FormField
              label="Fin"
              type="datetime-local"
              value={form.end_datetime}
              onChange={(value) => updateForm("end_datetime", value)}
              required
            />

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Contenu, objectifs ou précisions"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setShowForm(false);
              }}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Enregistrer les modifications"
                  : "Créer l'événement"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={eventTypeFilter}
          onChange={(event) =>
            setEventTypeFilter(
              event.target.value as "all" | CalendarEventType
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>

          {EVENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <select
          value={classroomFilter}
          onChange={(event) => setClassroomFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les classes</option>

          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-gray-900">
              Semaine du {formatDate(currentWeekStart)}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {filteredEvents.length} événement(s) cette semaine
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeWeek(-1)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Semaine précédente
            </button>

            <button
              type="button"
              onClick={() => changeWeek(1)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Semaine suivante
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-7">
            {weekDays.map((day, index) => {
              const dayKey = formatDate(day);
              const dayEvents = eventsByDay[dayKey] ?? [];

              return (
                <div
                  key={dayKey}
                  className="min-h-[220px] rounded-2xl border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="text-xs font-bold uppercase text-gray-500">
                    {WEEK_DAYS[index]}
                  </div>

                  <div className="mt-1 text-sm font-extrabold text-gray-900">
                    {day.getDate()}/{day.getMonth() + 1}
                  </div>

                  <div className="mt-3 space-y-2">
                    {dayEvents.length === 0 ? (
                      <p className="text-xs text-gray-400">Aucun événement</p>
                    ) : (
                      dayEvents.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => openEditForm(event)}
                          className={`w-full rounded-xl border p-3 text-left text-xs font-semibold hover:opacity-80 ${EVENT_TYPE_COLORS[event.event_type]}`}
                        >
                          <div className="font-bold">
                            {event.title}
                          </div>

                          <div className="mt-1 text-[11px] font-medium opacity-80">
                            {new Date(
                              event.start_datetime
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(
                              event.end_datetime
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          <div className="mt-1 text-[11px] opacity-80">
                            {event.classroom_name || "Classe non affectée"}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openCreateForm(day)}
                    className="mt-3 w-full rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-white"
                  >
                    + Ajouter
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des événements
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredEvents.length} événement(s)
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun événement trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une séance ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Événement</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Classe</th>
                  <th className="px-6 py-4">Enseignant</th>
                  <th className="px-6 py-4">Début</th>
                  <th className="px-6 py-4">Fin</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const isUpdating = updatingId === event.id;

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {event.title}
                        </div>

                        {event.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {event.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {EVENT_TYPE_LABELS[event.event_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.classroom_name || "Non affectée"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {event.teacher_name || "Non attribué"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(event.start_datetime).toLocaleString("fr-FR")}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(event.end_datetime).toLocaleString("fr-FR")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(event)}
                            disabled={isUpdating}
                            className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            {isUpdating ? "Suppression..." : "Supprimer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">{value}</p>
    </div>
  );
}