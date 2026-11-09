type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function CommitteeSearch({
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher un membre du comité..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}