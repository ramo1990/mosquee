"use client";

type Props = {
  search: string;
  levelFilter: string;
  statusFilter: "all" | "active" | "inactive";
  availableLevels: string[];

  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onStatusChange: (value: "all" | "active" | "inactive") => void;
};

export default function LearningProgramsFilters({
  search,
  levelFilter,
  statusFilter,
  availableLevels,
  onSearchChange,
  onLevelChange,
  onStatusChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">

      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher un programme..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={levelFilter}
        onChange={(event) => onLevelChange(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les niveaux</option>

        {availableLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as "all" | "active" | "inactive"
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>

    </div>
  );
}