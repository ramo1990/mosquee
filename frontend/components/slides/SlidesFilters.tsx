
"use client";

type Props = {
  search: string;
  groupFilter: string;
  statusFilter: "all" | "published" | "draft";
  availableGroups: string[];

  onSearchChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onStatusChange: (value: "all" | "published" | "draft") => void;
  onReset: () => void;
};

export default function SlidesFilters({
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
        placeholder="Rechercher une diapositive..."
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
          onStatusChange(
            event.target.value as "all" | "published" | "draft"
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiées</option>
        <option value="draft">Brouillons</option>
      </select>

      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
      >
        Réinitialiser
      </button>
    </div>
  );
}