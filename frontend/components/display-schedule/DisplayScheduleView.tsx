
"use client";

import { useDisplaySchedule } from "./useDisplaySchedule";

import DisplayScheduleStats from "./DisplayScheduleStats";
import DisplayScheduleFilters from "./DisplayScheduleFilters";
import DisplayScheduleTable from "./DisplayScheduleTable";
import DisplayScheduleModal from "./DisplayScheduleModal";

export default function DisplayScheduleView() {
  const schedule = useDisplaySchedule();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {schedule.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {schedule.error}
        </div>
      )}

      {schedule.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {schedule.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Programmation des affichages
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Planifiez les contenus, horaires et priorités
            d&apos;affichage sur les écrans.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={schedule.loadSchedules}
            disabled={schedule.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={schedule.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle programmation
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <DisplayScheduleStats
        total={schedule.schedules.length}
        active={schedule.activeCount}
        inactive={schedule.inactiveCount}
        groups={schedule.availableGroups.length}
      />

      {/* Modal */}
      <DisplayScheduleModal
        open={schedule.showForm}
        form={schedule.form}
        editingId={schedule.editingId}
        saving={schedule.saving}
        updateForm={schedule.updateForm}
        onSubmit={schedule.submitForm}
        onClose={schedule.closeForm}
      />

      {/* Filtres */}
      <DisplayScheduleFilters
        search={schedule.search}
        setSearch={schedule.setSearch}
        groupFilter={schedule.groupFilter}
        setGroupFilter={schedule.setGroupFilter}
        statusFilter={schedule.statusFilter}
        setStatusFilter={schedule.setStatusFilter}
        availableGroups={schedule.availableGroups}
      />

      {/* Tableau */}
      <DisplayScheduleTable
        schedules={schedule.filteredSchedules}
        loading={schedule.loading}
        updatingId={schedule.updatingId}
        onEdit={schedule.openEditForm}
        onToggleStatus={schedule.toggleStatus}
      />

    </div>
  );
}