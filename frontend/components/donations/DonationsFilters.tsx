import {
  DonationStatusFilter,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  projects: string[];
  search: string;
  statusFilter: DonationStatusFilter;
  projectFilter: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: DonationStatusFilter) => void;
  onProjectChange: (value: string) => void;
};

export default function DonationsFilters({
  projects,
  search,
  statusFilter,
  projectFilter,
  onSearchChange,
  onStatusChange,
  onProjectChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Rechercher un donateur, un projet ou une note..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as DonationStatusFilter
          )
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
        value={projectFilter}
        onChange={(event) =>
          onProjectChange(event.target.value)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les projets</option>

        {projects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>
    </div>
  );
}