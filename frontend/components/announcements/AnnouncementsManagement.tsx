
"use client";

import useAnnouncements from "./useAnnouncements";

import AnnouncementsStats from "./AnnouncementsStats";
import AnnouncementsFilters from "./AnnouncementsFilters";
import AnnouncementsView from "./AnnouncementsView";
import AnnouncementsModal from "./AnnouncementsModal";

export default function AnnouncementsManagement() {
  const announcements = useAnnouncements();

  return (
    <div className="space-y-6">
      {announcements.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {announcements.error}
        </div>
      )}

      {announcements.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {announcements.success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Annonces
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez et gérez les annonces destinées aux fidèles et aux écrans d&apos;affichage.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={announcements.loadAnnouncements}
            disabled={announcements.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={announcements.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle annonce
          </button>
        </div>
      </div>

      <AnnouncementsStats stats={announcements.stats} />

      <AnnouncementsModal
        open={announcements.showForm}
        editing={announcements.editingId !== null}
        form={announcements.form}
        saving={announcements.saving}
        onChange={announcements.updateForm}
        onSubmit={announcements.submitForm}
        onClose={announcements.closeForm}
      />

      <AnnouncementsFilters
        search={announcements.search}
        typeFilter={announcements.typeFilter}
        priorityFilter={announcements.priorityFilter}
        statusFilter={announcements.statusFilter}
        onSearchChange={announcements.setSearch}
        onTypeChange={announcements.setTypeFilter}
        onPriorityChange={announcements.setPriorityFilter}
        onStatusChange={announcements.setStatusFilter}
        onReset={announcements.resetFilters}
      />

      <AnnouncementsView
        announcements={announcements.filteredAnnouncements}
        loading={announcements.loading}
        updatingId={announcements.updatingId}
        onEdit={announcements.openEditForm}
        onTogglePublication={announcements.togglePublication}
        onToggleScreenDisplay={announcements.toggleScreenDisplay}
      />
    </div>
  );
}
