import type { CommitteeMember } from "./committee.types";

import { COMMITTEE_ROLE_LABELS } from "./committee.constants";

type Props = {
  members: CommitteeMember[];
  loading: boolean;
  updatingId: number | null;
  onSelect: (member: CommitteeMember) => void;
  onToggleStatus: (member: CommitteeMember) => void;
};

export default function CommitteeMembersTable({
  members,
  loading,
  updatingId,
  onSelect,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des membres
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {members.length} membre(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des membres...
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-bold text-gray-800">
            Aucun membre trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Aucun compte avec le rôle comité ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Membre</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Fonction</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {member.first_name} {member.last_name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {member.email || member.username}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {member.phone || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                      {member.committee_role_label ||
                        COMMITTEE_ROLE_LABELS[member.committee_role ?? ""] ||
                        "Membre du comité"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        member.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => onSelect(member)}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        Fonction
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(member)}
                        disabled={updatingId === member.id}
                        className={`font-semibold hover:underline disabled:opacity-50 ${
                          member.is_active
                            ? "text-red-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {updatingId === member.id
                          ? "Modification..."
                          : member.is_active
                            ? "Désactiver"
                            : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}