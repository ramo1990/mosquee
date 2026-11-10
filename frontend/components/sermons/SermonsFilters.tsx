
"use client";

import {
  Imam,
  SermonType,
  SermonStatusFilter,
  TYPE_LABELS,
  TYPE_OPTIONS,
} from "./types";

type Props = {
  imams: Imam[];

  search: string;
  setSearch: (value: string) => void;

  typeFilter: "all" | SermonType;
  setTypeFilter: (value: "all" | SermonType) => void;

  imamFilter: string;
  setImamFilter: (value: string) => void;

  statusFilter: SermonStatusFilter;
  setStatusFilter: (value: SermonStatusFilter) => void;
};

export default function SermonsFilters({
  imams,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  imamFilter,
  setImamFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un sermon..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value as "all" | SermonType)
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
        value={imamFilter}
        onChange={(event) => setImamFilter(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les imams</option>

        {imams.map((imam) => (
          <option key={imam.id} value={imam.id}>
            {imam.first_name} {imam.last_name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value as SermonStatusFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiés</option>
        <option value="draft">Brouillons</option>
      </select>
    </div>
  );
}