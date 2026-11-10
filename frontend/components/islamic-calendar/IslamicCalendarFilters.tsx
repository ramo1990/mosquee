
"use client";

import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_OPTIONS,
  type IslamicEventTypeFilter,
  type StatusFilter,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  eventTypeFilter: IslamicEventTypeFilter;
  setEventTypeFilter: (value: IslamicEventTypeFilter) => void;

  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
};

export default function IslamicCalendarFilters({
  search,
  setSearch,
  eventTypeFilter,
  setEventTypeFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un événement..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={eventTypeFilter}
        onChange={(event) =>
          setEventTypeFilter(
            event.target.value as IslamicEventTypeFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les types</option>

        {EVENT_TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {EVENT_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as StatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
    </div>
  );
}