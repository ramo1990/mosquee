
"use client";

import {
  ExpenseStatus,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  categories: string[];
  search: string;
  categoryFilter: string;
  statusFilter: "all" | ExpenseStatus;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: "all" | ExpenseStatus) => void;
};

export default function ExpensesFilters({
  categories,
  search,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: Props) {
  const inputClass =
    "rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
      {/* Recherche */}
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher une dépense..."
        className={inputClass}
      />

      {/* Catégories */}
      <select
        value={categoryFilter}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
        className={inputClass}
      >
        <option value="all">Toutes les catégories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Statuts */}
      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as "all" | ExpenseStatus
          )
        }
        className={inputClass}
      >
        <option value="all">Tous les statuts</option>

        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  );
}