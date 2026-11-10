
"use client";

import { FinanceFilters as FinanceFiltersType } from "./types";

type Props = {
  filters: FinanceFiltersType;
  categories: string[];

  updateFilter: (
    field: keyof FinanceFiltersType,
    value: string
  ) => void;

  resetFilters: () => void;
};

export default function FinanceFilters({
  filters,
  categories,
  updateFilter,
  resetFilters,
}: Props) {
  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[170px_170px_180px_1fr_120px]">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Du
        </label>

        <input
          type="date"
          value={filters.start_date}
          onChange={(event) =>
            updateFilter("start_date", event.target.value)
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Au
        </label>

        <input
          type="date"
          value={filters.end_date}
          onChange={(event) =>
            updateFilter("end_date", event.target.value)
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Type
        </label>

        <select
          value={filters.transaction_type}
          onChange={(event) =>
            updateFilter("transaction_type", event.target.value)
          }
          className={inputClass}
        >
          <option value="all">Tous</option>
          <option value="income">Recettes</option>
          <option value="expense">Dépenses</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Catégorie
        </label>

        <select
          value={filters.category}
          onChange={(event) =>
            updateFilter("category", event.target.value)
          }
          className={inputClass}
        >
          <option value="">Toutes les catégories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={resetFilters}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}