
"use client";

import { useCourseCalendar } from "./useCourseCalendar";

import CourseCalendarStats from "./CourseCalendarStats";
import CourseCalendarFilters from "./CourseCalendarFilters";
import CourseCalendarView from "./CourseCalendarView";
import CourseCalendarTable from "./CourseCalendarTable";
import CourseCalendarModal from "./CourseCalendarModal";

export default function CourseCalendarManagement() {
  const {
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
  } = useCourseCalendar();

  return (
    <div className="space-y-6">
      {/* Messages */}
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

      {/* En-tête */}
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

      {/* Statistiques */}
      <CourseCalendarStats
        eventsCount={events.length}
        courseCount={courseCount}
        examCount={examCount}
        classroomsCount={classrooms.length}
      />

      {/* Modal création / modification */}
      <CourseCalendarModal
        open={showForm}
        form={form}
        teachers={teachers}
        classrooms={classrooms}
        editingId={editingId}
        saving={saving}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      {/* Filtres */}
      <CourseCalendarFilters
        search={search}
        setSearch={setSearch}
        eventTypeFilter={eventTypeFilter}
        setEventTypeFilter={setEventTypeFilter}
        classroomFilter={classroomFilter}
        setClassroomFilter={setClassroomFilter}
        classrooms={classrooms}
      />

      {/* Calendrier hebdomadaire */}
      <CourseCalendarView
        weekDays={weekDays}
        currentWeekStart={currentWeekStart}
        eventsByDay={eventsByDay}
        filteredEventsCount={filteredEvents.filter((event) =>
          weekDays.some(
            (day) =>
              event.start_datetime.slice(0, 10) ===
              `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
          )
        ).length}
        loading={loading}
        onChangeWeek={changeWeek}
        onCreate={openCreateForm}
        onEdit={openEditForm}
      />

      {/* Tableau des événements */}
      <CourseCalendarTable
        events={filteredEvents}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditForm}
        onDelete={deleteEvent}
      />
    </div>
  );
}