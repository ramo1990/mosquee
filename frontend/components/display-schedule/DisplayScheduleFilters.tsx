
"use client";

import type { ScheduleStatusFilter } from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  groupFilter: string;
  setGroupFilter: (value: string) => void;

  statusFilter: ScheduleStatusFilter;
  setStatusFilter: (value: ScheduleStatusFilter) => void;

  availableGroups: string[];
};

export default function DisplayScheduleFilters({
  search,
  setSearch,
  groupFilter,
  setGroupFilter,
  statusFilter,
  setStatusFilter,
  availableGroups,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher une programmation..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={groupFilter}
        onChange={(event) => setGroupFilter(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les groupes</option>

        {availableGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value as ScheduleStatusFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actives</option>
        <option value="inactive">Inactives</option>
      </select>
    </div>
  );
}