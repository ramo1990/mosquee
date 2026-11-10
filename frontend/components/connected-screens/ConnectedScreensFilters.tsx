
"use client";

import type {
  ScreenStatusFilter,
} from "./types";

import {
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  statusFilter: ScreenStatusFilter;
  setStatusFilter: (value: ScreenStatusFilter) => void;

  groupFilter: string;
  setGroupFilter: (value: string) => void;

  availableGroups: string[];
};

export default function ConnectedScreensFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  groupFilter,
  setGroupFilter,
  availableGroups,
}: Props) {
  const inputClass =
    "rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">

      {/* Recherche */}
      <input
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Rechercher par nom, IP, MAC ou emplacement..."
        className={inputClass}
      />

      {/* Statut */}
      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value as ScreenStatusFilter
          )
        }
        className={inputClass}
      >
        <option value="all">
          Tous les statuts
        </option>

        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      {/* Groupe */}
      <select
        value={groupFilter}
        onChange={(event) =>
          setGroupFilter(event.target.value)
        }
        className={inputClass}
      >
        <option value="all">
          Tous les groupes
        </option>

        {availableGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

    </div>
  );
}