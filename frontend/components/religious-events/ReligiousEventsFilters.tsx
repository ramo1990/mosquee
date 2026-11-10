
import {
  EventTypeFilter,
  EventStatusFilter,
  PublicationFilter,
  TYPE_LABELS,
  TYPE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  typeFilter: EventTypeFilter;
  setTypeFilter: (value: EventTypeFilter) => void;

  statusFilter: EventStatusFilter;
  setStatusFilter: (value: EventStatusFilter) => void;

  publicationFilter: PublicationFilter;
  setPublicationFilter: (value: PublicationFilter) => void;
};

export default function ReligiousEventsFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  publicationFilter,
  setPublicationFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_190px_170px_170px]">

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un événement..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value as EventTypeFilter)
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
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as EventStatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>

        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        value={publicationFilter}
        onChange={(event) =>
          setPublicationFilter(
            event.target.value as PublicationFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les publications</option>
        <option value="published">Publiés</option>
        <option value="draft">Brouillons</option>
      </select>

    </div>
  );
}