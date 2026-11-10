
"use client";

import { useReligiousAnnouncements } from "./useReligiousAnnouncements";

import ReligiousAnnouncementsStats from "./ReligiousAnnouncementsStats";
import ReligiousAnnouncementsView from "./ReligiousAnnouncementsView";

export default function ReligiousAnnouncementsManagement() {
  const {
    announcements,
    filteredAnnouncements,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    typeFilter,
    setTypeFilter,

    priorityFilter,
    setPriorityFilter,

    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,

    loadAnnouncements,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  } = useReligiousAnnouncements();

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
            Annonces religieuses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez les annonces liées aux prières, cours, rappels et activités religieuses.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadAnnouncements}
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
            Nouvelle annonce
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <ReligiousAnnouncementsStats
        total={announcements.length}
        published={publishedCount}
        drafts={draftCount}
      />

      {/* Vue principale */}
      <ReligiousAnnouncementsView
        announcements={announcements}
        filteredAnnouncements={filteredAnnouncements}
        loading={loading}
        saving={saving}
        updatingId={updatingId}
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showForm={showForm}
        editingId={editingId}
        form={form}
        updateForm={updateForm}
        submitForm={submitForm}
        closeForm={closeForm}
        openEditForm={openEditForm}
        togglePublication={togglePublication}
      />
    </div>
  );
}