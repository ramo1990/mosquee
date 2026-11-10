import type { MemberStatus } from "./members.types";

type Props = {
  search: string;
  statusFilter: string;
  loading: boolean;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
};

export default function MembersFilters({
  search,
  statusFilter,
  loading,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher un fidèle..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
        <option value="pending">En attente</option>
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
      >
        Actualiser
      </button>
    </div>
  );
}