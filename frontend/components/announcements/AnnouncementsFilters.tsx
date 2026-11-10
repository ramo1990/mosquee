
"use client";

import {
  AnnouncementTypeFilter,
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
  TYPE_LABELS,
  TYPE_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./types";

type Props = {
  search: string;
  typeFilter: AnnouncementTypeFilter;
  priorityFilter: AnnouncementPriorityFilter;
  statusFilter: AnnouncementStatusFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: AnnouncementTypeFilter) => void;
  onPriorityChange: (value: AnnouncementPriorityFilter) => void;
  onStatusChange: (value: AnnouncementStatusFilter) => void;
  onReset: () => void;
};

export default function AnnouncementsFilters({
  search,
  typeFilter,
  priorityFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_170px_180px_auto]">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher une annonce..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          onTypeChange(event.target.value as AnnouncementTypeFilter)
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
        value={priorityFilter}
        onChange={(event) =>
          onPriorityChange(
            event.target.value as AnnouncementPriorityFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les priorités</option>
        {PRIORITY_OPTIONS.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as AnnouncementStatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
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