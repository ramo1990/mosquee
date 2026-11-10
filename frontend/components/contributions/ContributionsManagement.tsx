"use client";

import { useContributions } from "./useContributions";

import ContributionsStats from "./ContributionsStats";
import ContributionsFilters from "./ContributionsFilters";
import ContributionsView from "./ContributionsView";
import ContributionsModal from "./ContributionsModal";

export default function ContributionsManagement() {
  const contributions = useContributions();

  return (
    <div className="space-y-6">
      {/* Messages */}
      {contributions.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {contributions.error}
        </div>
      )}

      {contributions.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {contributions.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Cotisations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Suivez les cotisations des fidèles, les échéances et
            l’historique des paiements.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={contributions.loadContributions}
            disabled={contributions.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={contributions.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle cotisation
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <ContributionsStats
        totalExpected={contributions.totalExpected}
        totalPaid={contributions.totalPaid}
        pendingCount={contributions.pendingCount}
        paidCount={contributions.paidCount}
      />

      {/* Formulaire */}
      <ContributionsModal
        open={contributions.showForm}
        form={contributions.form}
        members={contributions.members}
        editingId={contributions.editingId}
        saving={contributions.saving}
        updateForm={contributions.updateForm}
        onSubmit={contributions.submitForm}
        onClose={contributions.closeForm}
      />

      {/* Filtres */}
      <ContributionsFilters
        members={contributions.members}
        search={contributions.search}
        statusFilter={contributions.statusFilter}
        memberFilter={contributions.memberFilter}
        onSearchChange={contributions.setSearch}
        onStatusChange={contributions.setStatusFilter}
        onMemberChange={contributions.setMemberFilter}
      />

      {/* Liste */}
      <ContributionsView
        contributions={contributions.filteredContributions}
        loading={contributions.loading}
        updatingId={contributions.updatingId}
        onEdit={contributions.openEditForm}
        onMarkAsPaid={contributions.markAsPaid}
      />
    </div>
  );
}