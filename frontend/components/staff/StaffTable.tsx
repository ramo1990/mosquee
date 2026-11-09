
import type { StaffMember } from "./staff.types";
import { ROLE_LABELS } from "./staff.constants";

type Props = {
  members: StaffMember[];
  loading: boolean;
  updatingId: number | null;
  onToggleStatus: (member: StaffMember) => void;
};

export default function StaffTable({
  members,
  loading,
  updatingId,
  onToggleStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des imams et enseignants
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {members.length} personne(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun résultat trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Aucun imam ou enseignant ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Fonction</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                      {member.email || member.username}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {member.phone || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        member.role === "imam"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ROLE_LABELS[member.role]}
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
                    <div className="flex justify-end">
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
