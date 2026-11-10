
"use client";

import useSlides from "./useSlides";

import SlidesStats from "./SlidesStats";
import SlidesFilters from "./SlidesFilters";
import SlidesView from "./SlidesView";
import SlidesModal from "./SlidesModal";

export default function SlidesManagement() {
  const slides = useSlides();

  return (
    <div className="space-y-6">
      {/* Erreur */}
      {slides.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {slides.error}
        </div>
      )}

      {/* Succès */}
      {slides.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {slides.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des diapositives
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et organisez les diapositives affichées sur les écrans.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={slides.loadSlides}
            disabled={slides.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={slides.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle diapositive
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <SlidesStats stats={slides.stats} />

      {/* Modal */}
      <SlidesModal
        open={slides.showForm}
        editing={slides.editingId !== null}
        form={slides.form}
        saving={slides.saving}
        onChange={slides.updateForm}
        onSubmit={slides.submitForm}
        onClose={slides.closeForm}
      />

      {/* Filtres */}
      <SlidesFilters
        search={slides.search}
        groupFilter={slides.groupFilter}
        statusFilter={slides.statusFilter}
        availableGroups={slides.availableGroups}
        onSearchChange={slides.setSearch}
        onGroupChange={slides.setGroupFilter}
        onStatusChange={slides.setStatusFilter}
        onReset={slides.resetFilters}
      />

      {/* Liste */}
      <SlidesView
        slides={slides.filteredSlides}
        loading={slides.loading}
        updatingId={slides.updatingId}
        onEdit={slides.openEditForm}
        onTogglePublication={slides.togglePublication}
        onMove={slides.moveSlide}
      />
    </div>
  );
}