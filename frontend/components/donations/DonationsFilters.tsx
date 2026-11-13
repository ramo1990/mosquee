
"use client";

type DonationsFiltersProps = {
  projects: string[];
  search: string;
  statusFilter: string;
  projectFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
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
}: DonationsFiltersProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">
          Rechercher des dons
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Filtrez les contributions selon vos critères.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label htmlFor="donation-search" className="mb-2 block text-sm font-semibold text-gray-700">
            Recherche
          </label>
          <input
            id="donation-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nom du donateur..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label htmlFor="donation-status" className="mb-2 block text-sm font-semibold text-gray-700">
            Statut
          </label>
          <select
            id="donation-status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">Tous les statuts</option>
            <option value="received">Reçus</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div>
          <label htmlFor="donation-project" className="mb-2 block text-sm font-semibold text-gray-700">
            Projet
          </label>
          <select
            id="donation-project"
            value={projectFilter}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">Tous les projets</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}