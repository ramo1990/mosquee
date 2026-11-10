import type { Member } from "./members.types";

import MemberStatusBadge from "./MemberStatusBadge";

type Props = {
  members: Member[];
  loading: boolean;

  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
};

export default function MembersTable({
  members,
  loading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des fidèles
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {members.length} membre(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement des fidèles...
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun fidèle trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez un fidèle ou modifiez votre recherche.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Fidèle</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Numéro</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {member.first_name} {member.last_name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {member.email || "Aucun e-mail"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {member.phone || "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {member.member_number || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <MemberStatusBadge
                      status={member.status || "active"}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(member)}
                        className="font-semibold text-emerald-700 hover:underline"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(member)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Supprimer
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