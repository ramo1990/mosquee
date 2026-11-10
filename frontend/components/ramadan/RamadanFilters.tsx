
"use client";

import type { RamadanPublicationFilter } from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  publicationFilter: RamadanPublicationFilter;
  setPublicationFilter: (
    value: RamadanPublicationFilter
  ) => void;
};

export default function RamadanFilters({
  search,
  setSearch,
  publicationFilter,
  setPublicationFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher par jour, date, activité ou note..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={publicationFilter}
        onChange={(event) =>
          setPublicationFilter(
            event.target.value as RamadanPublicationFilter
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