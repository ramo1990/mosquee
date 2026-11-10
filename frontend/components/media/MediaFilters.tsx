
import type { MediaType, MediaStatusFilter } from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  typeFilter: "all" | MediaType;
  setTypeFilter: (value: "all" | MediaType) => void;

  categoryFilter: string;
  setCategoryFilter: (value: string) => void;

  statusFilter: MediaStatusFilter;
  setStatusFilter: (value: MediaStatusFilter) => void;

  availableCategories: string[];
};

export default function MediaFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  availableCategories,
}: Props) {
  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_160px_200px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un média..."
        className={inputClass}
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value as "all" | MediaType)
        }
        className={inputClass}
      >
        <option value="all">Tous les types</option>
        <option value="image">Images</option>
        <option value="video">Vidéos</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(event) => setCategoryFilter(event.target.value)}
        className={inputClass}
      >
        <option value="all">Toutes les catégories</option>

        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value as MediaStatusFilter
          )
        }
        className={inputClass}
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiés</option>
        <option value="draft">Brouillons</option>
      </select>
    </div>
  );
}