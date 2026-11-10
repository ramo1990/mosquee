import {
  NotificationTypeFilter,
  NotificationStatusFilter,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  typeFilter: NotificationTypeFilter;
  setTypeFilter: (value: NotificationTypeFilter) => void;

  statusFilter: NotificationStatusFilter;
  setStatusFilter: (
    value: NotificationStatusFilter
  ) => void;
};

export default function NotificationsFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">

      {/* Recherche */}
      <input
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Rechercher une notification..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      {/* Filtre par type */}
      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(
            event.target.value as NotificationTypeFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les types</option>
        <option value="info">Information</option>
        <option value="success">Succès</option>
        <option value="warning">Avertissement</option>
        <option value="error">Erreur</option>
      </select>

      {/* Filtre par statut */}
      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value as NotificationStatusFilter
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="unread">Non lues</option>
        <option value="read">Lues</option>
      </select>

    </div>
  );
}