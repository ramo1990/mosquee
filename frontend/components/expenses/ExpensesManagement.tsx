
"use client";

import { useExpenses } from "./useExpenses";

import ExpensesStats from "./ExpensesStats";
import ExpensesFilters from "./ExpensesFilters";
import ExpensesView from "./ExpensesView";
import ExpensesModal from "./ExpensesModal";

export default function ExpensesManagement() {
  const expenses = useExpenses();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {expenses.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {expenses.error}
        </div>
      )}

      {expenses.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {expenses.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Dépenses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enregistrez et suivez les dépenses liées au fonctionnement
            et aux projets de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={expenses.loadExpenses}
            disabled={expenses.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={expenses.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvelle dépense
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <ExpensesStats
        totalExpenses={expenses.totalExpenses}
        pendingCount={expenses.pendingCount}
        approvedCount={expenses.approvedCount}
        categoriesCount={expenses.availableCategories.length}
      />

      {/* Modal */}
      <ExpensesModal
        open={expenses.showForm}
        form={expenses.form}
        editingId={expenses.editingId}
        saving={expenses.saving}
        updateForm={expenses.updateForm}
        onSubmit={expenses.submitForm}
        onClose={expenses.closeForm}
      />

      {/* Filtres */}
      <ExpensesFilters
        categories={expenses.availableCategories}
        search={expenses.search}
        categoryFilter={expenses.categoryFilter}
        statusFilter={expenses.statusFilter}
        onSearchChange={expenses.setSearch}
        onCategoryChange={expenses.setCategoryFilter}
        onStatusChange={expenses.setStatusFilter}
      />

      {/* Tableau */}
      <ExpensesView
        expenses={expenses.filteredExpenses}
        loading={expenses.loading}
        updatingId={expenses.updatingId}
        onEdit={expenses.openEditForm}
        onUpdateStatus={expenses.updateStatus}
      />
    </div>
  );
}
