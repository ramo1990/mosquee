
"use client";

import useDisplayPrayerTimes from "./useDisplayPrayerTimes";

import DisplayPrayerTimesStats from "./DisplayPrayerTimesStats";
import DisplayPrayerTimesFilters from "./DisplayPrayerTimesFilters";
import DisplayPrayerTimesView from "./DisplayPrayerTimesView";
import DisplayPrayerTimesModal from "./DisplayPrayerTimesModal";

export default function DisplayPrayerTimesManagement() {
  const prayerTimes = useDisplayPrayerTimes();

  return (
    <div className="space-y-6">

      {/* Erreur */}
      {prayerTimes.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {prayerTimes.error}
        </div>
      )}

      {/* Succès */}
      {prayerTimes.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {prayerTimes.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Horaires de prière affichés
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires de prière et l’iqama affichés sur les écrans.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={prayerTimes.loadPrayerTimes}
            disabled={prayerTimes.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={prayerTimes.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter des horaires
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <DisplayPrayerTimesStats
        stats={prayerTimes.stats}
      />

      {/* Modal */}
      <DisplayPrayerTimesModal
        open={prayerTimes.showForm}
        editing={prayerTimes.editingId !== null}
        form={prayerTimes.form}
        saving={prayerTimes.saving}
        onChange={prayerTimes.updateForm}
        onSubmit={prayerTimes.submitForm}
        onClose={prayerTimes.closeForm}
      />

      {/* Filtres */}
      <DisplayPrayerTimesFilters
        search={prayerTimes.search}
        groupFilter={prayerTimes.groupFilter}
        statusFilter={prayerTimes.statusFilter}
        availableGroups={prayerTimes.availableGroups}
        onSearchChange={prayerTimes.setSearch}
        onGroupChange={prayerTimes.setGroupFilter}
        onStatusChange={prayerTimes.setStatusFilter}
        onReset={prayerTimes.resetFilters}
      />

      {/* Tableau */}
      <DisplayPrayerTimesView
        prayerTimes={prayerTimes.filteredPrayerTimes}
        loading={prayerTimes.loading}
        updatingId={prayerTimes.updatingId}
        onEdit={prayerTimes.openEditForm}
        onTogglePublication={prayerTimes.togglePublication}
      />

    </div>
  );
}
