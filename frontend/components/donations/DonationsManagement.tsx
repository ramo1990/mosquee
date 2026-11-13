
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
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>⚠️</span>
          <span>{donations.error}</span>
        </div>
      )}

      {donations.success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <span>✓</span>
          <span>{donations.success}</span>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🤲
            </span>

            <h2 className="text-xl font-extrabold text-gray-900">
              Gestion des dons
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Consultez, enregistrez et suivez les contributions
            destinées à votre mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={donations.loadDonations}
            disabled={donations.loading}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {donations.loading ? "Actualisation..." : "↻ Actualiser"}
          </button>

          <button
            type="button"
            onClick={donations.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900"
          >
            + Enregistrer un don
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

      {/* Recherche et filtres */}
      <DonationsFilters
        projects={donations.availableProjects}
        search={donations.search}
        statusFilter={donations.statusFilter}
        projectFilter={donations.projectFilter}
        onSearchChange={donations.setSearch}
        onStatusChange={donations.setStatusFilter}
        onProjectChange={donations.setProjectFilter}
      />

      {/* Tableau */}
      <DonationsView
        donations={donations.filteredDonations}
        loading={donations.loading}
        updatingId={donations.updatingId}
        onEdit={donations.openEditForm}
        onMarkAsReceived={donations.markAsReceived}
      />

      {/* Formulaire */}
      <DonationsModal
        open={donations.showForm}
        form={donations.form}
        editingId={donations.editingId}
        saving={donations.saving}
        updateForm={donations.updateForm}
        onSubmit={donations.submitForm}
        onClose={donations.closeForm}
      />
    </div>
  );
}