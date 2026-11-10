
"use client";

import { useRamadan } from "./useRamadan";

import RamadanStats from "./RamadanStats";
import RamadanView from "./RamadanView";
import RamadanModal from "./RamadanModal";

export default function RamadanManagement() {
  const {
    ramadanDays,
    filteredDays,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    publicationFilter,
    setPublicationFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,
    activityCount,

    loadRamadanDays,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  } = useRamadan();

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
            Programme Ramadan
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires du Suhoor, de l’Iftar, des Tarawih et des activités du mois de Ramadan.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadRamadanDays}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter une journée
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <RamadanStats
        totalCount={ramadanDays.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
        activityCount={activityCount}
      />

      {/* Modal */}
      <RamadanModal
        open={showForm}
        form={form}
        editingId={editingId}
        saving={saving}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      {/* Filtres et tableau */}
      <RamadanView
        days={filteredDays}
        loading={loading}
        updatingId={updatingId}
        search={search}
        setSearch={setSearch}
        publicationFilter={publicationFilter}
        setPublicationFilter={setPublicationFilter}
        onEdit={openEditForm}
        onTogglePublication={togglePublication}
      />

    </div>
  );
}