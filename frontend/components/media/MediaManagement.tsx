
"use client";

import useMedia from "./useMedia";

import MediaStats from "./MediaStats";
import MediaView from "./MediaView";
import MediaModal from "./MediaModal";

export default function MediaManagement() {
  const media = useMedia();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {media.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {media.error}
        </div>
      )}

      {media.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {media.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Images et vidéos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ajoutez et organisez les médias utilisés dans les affichages.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={media.loadMedia}
            disabled={media.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={media.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter un média
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <MediaStats
        total={media.mediaItems.length}
        images={media.imageCount}
        videos={media.videoCount}
        published={media.publishedCount}
      />

      {/* Vue principale */}
      <MediaView
        media={media.filteredMedia}
        loading={media.loading}
        updatingId={media.updatingId}

        search={media.search}
        setSearch={media.setSearch}

        typeFilter={media.typeFilter}
        setTypeFilter={media.setTypeFilter}

        categoryFilter={media.categoryFilter}
        setCategoryFilter={media.setCategoryFilter}

        statusFilter={media.statusFilter}
        setStatusFilter={media.setStatusFilter}

        availableCategories={media.availableCategories}

        onEdit={media.openEditForm}
        onTogglePublication={media.togglePublication}
      />

      {/* Modale */}
      <MediaModal
        open={media.showForm}
        form={media.form}
        editingId={media.editingId}
        saving={media.saving}
        updateForm={media.updateForm}
        onSubmit={media.submitForm}
        onClose={media.closeForm}
      />

    </div>
  );
}