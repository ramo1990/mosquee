
"use client";

import { useFinance } from "./useFinance";

import FinanceStats from "./FinanceStats";
import FinanceFilters from "./FinanceFilters";
import FinanceSummary from "./FinanceSummary";
import FinanceTable from "./FinanceTable";

export default function FinanceManagement() {
  const finance = useFinance();

  return (
    <div className="space-y-6">
      {/* Messages */}
      {finance.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {finance.error}
        </div>
      )}

      {finance.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {finance.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Finances et rapports
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez les recettes, dépenses, soldes et rapports
            financiers de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={finance.loadFinanceData}
            disabled={finance.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={finance.exportCsv}
            disabled={
              finance.loading ||
              finance.filteredTransactions.length === 0
            }
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            Exporter en CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <FinanceStats
        totalIncome={finance.summary.total_income}
        totalExpenses={finance.summary.total_expenses}
        balance={finance.summary.balance}
        filteredBalance={finance.filteredBalance}
      />

      {/* Filtres */}
      <FinanceFilters
        filters={finance.filters}
        categories={finance.availableCategories}
        updateFilter={finance.updateFilter}
        resetFilters={finance.resetFilters}
      />

      {/* Résumé filtré */}
      <FinanceSummary
        income={finance.filteredIncome}
        expenses={finance.filteredExpenses}
      />

      {/* Historique */}
      <FinanceTable
        transactions={finance.filteredTransactions}
        loading={finance.loading}
      />
    </div>
  );
}