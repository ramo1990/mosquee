import {
  Member,
  ContributionStatusFilter,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  members: Member[];
  search: string;
  statusFilter: ContributionStatusFilter;
  memberFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ContributionStatusFilter) => void;
  onMemberChange: (value: string) => void;
};

export default function ContributionsFilters({
  members,
  search,
  statusFilter,
  memberFilter,
  onSearchChange,
  onStatusChange,
  onMemberChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Rechercher un fidèle, une note ou une date..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as ContributionStatusFilter
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
        value={memberFilter}
        onChange={(event) =>
          onMemberChange(event.target.value)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les fidèles</option>

        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.first_name} {member.last_name}
          </option>
        ))}
      </select>
    </div>
  );
}