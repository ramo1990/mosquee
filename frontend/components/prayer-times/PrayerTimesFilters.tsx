
"use client";

import { PrayerStatusFilter } from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: PrayerStatusFilter;
  setStatusFilter: (value: PrayerStatusFilter) => void;
};

export default function PrayerTimesFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher par date ou note..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as PrayerStatusFilter)
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