
"use client";

import {
  TYPE_LABELS,
  TYPE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  ActivityTypeFilter,
  ActivityStatusFilter,
  ActivityPublicationFilter,
} from "./types";

type ActivitiesFiltersProps = {
  search: string;
  typeFilter: ActivityTypeFilter;
  statusFilter: ActivityStatusFilter;
  publicationFilter: ActivityPublicationFilter;

  onSearchChange: (value: string) => void;
  onTypeChange: (value: ActivityTypeFilter) => void;
  onStatusChange: (value: ActivityStatusFilter) => void;
  onPublicationChange: (
    value: ActivityPublicationFilter
  ) => void;
  onReset: () => void;
};

export default function ActivitiesFilters({
  search,
  typeFilter,
  statusFilter,
  publicationFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onPublicationChange,
  onReset,
}: ActivitiesFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_170px_170px_130px]">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher une activité..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          onTypeChange(event.target.value as ActivityTypeFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les types</option>

        {TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as ActivityStatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>

        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        value={publicationFilter}
        onChange={(event) =>
          onPublicationChange(
            event.target.value as ActivityPublicationFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les publications</option>
        <option value="published">Publiées</option>
        <option value="draft">Brouillons</option>
      </select>

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
      >
        Réinitialiser
      </button>
    </div>
  );
}