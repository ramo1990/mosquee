import type { CommitteeMember } from "./committee.types";

type Props = {
  selectedMember: CommitteeMember | null;
  committeeRole: string;
  saving: boolean;
  onRoleChange: (role: string) => void;
  onSave: () => void;
};

export default function CommitteeRoleEditor({
  selectedMember,
  committeeRole,
  saving,
  onRoleChange,
  onSave,
}: Props) {
  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-bold text-gray-900">
        Fonction du membre
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {selectedMember
          ? `Membre sélectionné : ${selectedMember.first_name} ${selectedMember.last_name}`.trim()
          : "Sélectionnez un membre dans la liste."}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Fonction au comité
          </label>

          <select
            value={committeeRole}
            onChange={(event) => onRoleChange(event.target.value)}
            className={inputClass}
          >
            <option value="president">Président</option>
            <option value="vice_president">Vice-président</option>
            <option value="secretary">Secrétaire</option>
            <option value="treasurer">Trésorier</option>
            <option value="member">Membre du comité</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={!selectedMember || saving}
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer la fonction"}
        </button>
      </div>
    </div>
  );
}