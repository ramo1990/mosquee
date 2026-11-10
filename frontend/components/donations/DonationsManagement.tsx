"use client";

import { useDonations } from "./useDonations";

import DonationsStats from "./DonationsStats";
import DonationsFilters from "./DonationsFilters";
import DonationsView from "./DonationsView";
import DonationsModal from "./DonationsModal";

export default function DonationsManagement() {
  const donations = useDonations();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {donations.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {donations.error}
        </div>
      )}

      {donations.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {donations.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Dons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les dons reçus pour les projets et
            activités de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={donations.loadDonations}
            disabled={donations.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={donations.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Enregistrer un don
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <DonationsStats
        totalReceived={donations.totalReceived}
        receivedCount={donations.receivedCount}
        pendingCount={donations.pendingCount}
        projectsCount={donations.availableProjects.length}
      />

      {/* Modal */}
      <DonationsModal
        open={donations.showForm}
        form={donations.form}
        editingId={donations.editingId}
        saving={donations.saving}
        updateForm={donations.updateForm}
        onSubmit={donations.submitForm}
        onClose={donations.closeForm}
      />

      {/* Filtres */}
      <DonationsFilters
        projects={donations.availableProjects}
        search={donations.search}
        statusFilter={donations.statusFilter}
        projectFilter={donations.projectFilter}
        onSearchChange={donations.setSearch}
        onStatusChange={donations.setStatusFilter}
        onProjectChange={donations.setProjectFilter}
      />

      {/* Liste des dons */}
      <DonationsView
        donations={donations.filteredDonations}
        loading={donations.loading}
        updatingId={donations.updatingId}
        onEdit={donations.openEditForm}
        onMarkAsReceived={donations.markAsReceived}
      />
    </div>
  );
}