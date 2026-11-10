
"use client";

import { useIslamicCalendar } from "./useIslamicCalendar";

import IslamicCalendarStats from "./IslamicCalendarStats";
import IslamicCalendarFilters from "./IslamicCalendarFilters";
import IslamicCalendarTable from "./IslamicCalendarTable";
import IslamicCalendarModal from "./IslamicCalendarModal";

import { EVENT_TYPE_OPTIONS } from "./types";

export default function IslamicCalendarView() {
  const calendar = useIslamicCalendar();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {calendar.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {calendar.error}
        </div>
      )}

      {calendar.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {calendar.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Calendrier islamique
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les dates importantes du calendrier hégirien et les événements religieux.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={calendar.loadEvents}
            disabled={calendar.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={calendar.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter un événement
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <IslamicCalendarStats
        total={calendar.events.length}
        active={calendar.activeCount}
        inactive={calendar.inactiveCount}
        types={EVENT_TYPE_OPTIONS.length}
      />

      {/* Modal */}
      <IslamicCalendarModal
        open={calendar.showForm}
        form={calendar.form}
        editingId={calendar.editingId}
        saving={calendar.saving}
        updateForm={calendar.updateForm}
        onSubmit={calendar.submitForm}
        onClose={calendar.closeForm}
      />

      {/* Filtres */}
      <IslamicCalendarFilters
        search={calendar.search}
        setSearch={calendar.setSearch}
        eventTypeFilter={calendar.eventTypeFilter}
        setEventTypeFilter={calendar.setEventTypeFilter}
        statusFilter={calendar.statusFilter}
        setStatusFilter={calendar.setStatusFilter}
      />

      {/* Tableau */}
      <IslamicCalendarTable
        events={calendar.filteredEvents}
        loading={calendar.loading}
        updatingId={calendar.updatingId}
        onEdit={calendar.openEditForm}
        onToggleStatus={calendar.toggleStatus}
      />

    </div>
  );
}