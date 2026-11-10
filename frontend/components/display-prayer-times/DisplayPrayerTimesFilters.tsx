
"use client";

import { PrayerStatusFilter } from "./types";

type Props = {
  search: string;
  groupFilter: string;
  statusFilter: PrayerStatusFilter;
  availableGroups: string[];

  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onStatusChange: (value: PrayerStatusFilter) => void;
  onReset: () => void;
};

export default function DisplayPrayerTimesFilters({
  search,
  groupFilter,
  statusFilter,
  availableGroups,
  onSearchChange,
  onGroupChange,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px_auto]">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher par date, groupe ou note..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={groupFilter}
        onChange={(event) => onGroupChange(event.target.value)}
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
          onStatusChange(event.target.value as PrayerStatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiés</option>
        <option value="draft">Brouillons</option>
      </select>

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Réinitialiser
      </button>
    </div>
  );
}