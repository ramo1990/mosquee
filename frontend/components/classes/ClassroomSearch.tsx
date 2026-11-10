
import { ClassroomStatusFilter } from "./classroom.types";

type Props = {
  search: string;
  statusFilter: ClassroomStatusFilter;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ClassroomStatusFilter) => void;
  onRefresh: () => void;
};

export default function ClassroomSearch({
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
        placeholder="Rechercher une classe..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as ClassroomStatusFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actives</option>
        <option value="inactive">Inactives</option>
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Chargement..." : "Actualiser"}
      </button>
    </div>
  );
}
