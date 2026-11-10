
"use client";

import useActivities from "./useActivities";

import ActivitiesStats from "./ActivitiesStats";
import ActivitiesFilters from "./ActivitiesFilters";
import ActivitiesView from "./ActivitiesView";
import ActivitiesModal from "./ActivitiesModal";

export default function ActivitiesManagement() {
  const activities = useActivities();

  return (
    <div className="space-y-6">
      {/* Messages */}
      {activities.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {activities.error}
        </div>
      )}

      {activities.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {activities.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Activités et événements
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et suivez les activités, rencontres, formations et
            événements de la communauté.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={activities.loadActivities}
            disabled={activities.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={activities.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle activité
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <ActivitiesStats stats={activities.stats} />

      {/* Modal */}
      <ActivitiesModal
        open={activities.showForm}
        editing={activities.editingId !== null}
        form={activities.form}
        saving={activities.saving}
        onChange={activities.updateForm}
        onSubmit={activities.submitForm}
        onClose={activities.closeForm}
      />

      {/* Filtres */}
      <ActivitiesFilters
        search={activities.search}
        typeFilter={activities.typeFilter}
        statusFilter={activities.statusFilter}
        publicationFilter={activities.publicationFilter}
        onSearchChange={activities.setSearch}
        onTypeChange={activities.setTypeFilter}
        onStatusChange={activities.setStatusFilter}
        onPublicationChange={activities.setPublicationFilter}
        onReset={activities.resetFilters}
      />

      {/* Liste des activités */}
      <ActivitiesView
        activities={activities.filteredActivities}
        loading={activities.loading}
        updatingId={activities.updatingId}
        onEdit={activities.openEditForm}
        onTogglePublication={activities.togglePublication}
        onChangeStatus={activities.changeStatus}
      />
    </div>
  );
}
