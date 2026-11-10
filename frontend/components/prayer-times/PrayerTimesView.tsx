
"use client";

import PrayerTimesStats from "./PrayerTimesStats";
import PrayerTimesFilters from "./PrayerTimesFilters";
import PrayerTimesTable from "./PrayerTimesTable";
import PrayerTimesModal from "./PrayerTimesModal";
import { usePrayerTimes } from "./usePrayerTimes";

export default function PrayerTimesView() {
  const prayer = usePrayerTimes();

  return (
    <div className="space-y-6">
      {prayer.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {prayer.error}
        </div>
      )}

      {prayer.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {prayer.success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Horaires de prière
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires quotidiens, l’iqama, la Jumua
            et les horaires spécifiques à la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={prayer.loadPrayerTimes}
            disabled={prayer.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={prayer.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter des horaires
          </button>
        </div>
      </div>

      <PrayerTimesStats
        total={prayer.prayerTimes.length}
        active={prayer.activeCount}
        inactive={prayer.inactiveCount}
      />

      <PrayerTimesModal
        open={prayer.showForm}
        editingId={prayer.editingId}
        form={prayer.form}
        saving={prayer.saving}
        updateForm={prayer.updateForm}
        onSubmit={prayer.submitForm}
        onClose={prayer.closeForm}
      />

      <PrayerTimesFilters
        search={prayer.search}
        setSearch={prayer.setSearch}
        statusFilter={prayer.statusFilter}
        setStatusFilter={prayer.setStatusFilter}
      />

      <PrayerTimesTable
        prayerTimes={prayer.filteredPrayerTimes}
        loading={prayer.loading}
        updatingId={prayer.updatingId}
        onEdit={prayer.openEditForm}
        onToggleStatus={prayer.toggleStatus}
      />
    </div>
  );
}