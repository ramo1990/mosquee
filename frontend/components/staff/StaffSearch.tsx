
type Props = {
  search: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
};

export default function StaffSearch({
  search,
  roleFilter,
  onSearchChange,
  onRoleChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
      <input
        type="search"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Rechercher un imam ou enseignant..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={roleFilter}
        onChange={(event) =>
          onRoleChange(event.target.value)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les profils</option>
        <option value="imam">Imams</option>
        <option value="teacher">Enseignants</option>
      </select>
    </div>
  );
}
