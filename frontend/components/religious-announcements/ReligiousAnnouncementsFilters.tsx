
"use client";

import {
  TYPE_LABELS,
  TYPE_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  AnnouncementTypeFilter,
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  typeFilter: AnnouncementTypeFilter;
  setTypeFilter: (value: AnnouncementTypeFilter) => void;

  priorityFilter: AnnouncementPriorityFilter;
  setPriorityFilter: (value: AnnouncementPriorityFilter) => void;

  statusFilter: AnnouncementStatusFilter;
  setStatusFilter: (value: AnnouncementStatusFilter) => void;
};

export default function ReligiousAnnouncementsFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_170px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher une annonce..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value as AnnouncementTypeFilter)
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
          setPriorityFilter(
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
          setStatusFilter(
            event.target.value as AnnouncementStatusFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiées</option>
        <option value="draft">Brouillons</option>
      </select>
    </div>
  );
}