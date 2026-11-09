
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGetList,
  apiPatch,
} from "@/lib/api";

type CommitteeMember = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  mosque?: number | null;
};

const ROLE_LABELS: Record<string, string> = {
  president: "Président",
  vice_president: "Vice-président",
  secretary: "Secrétaire",
  treasurer: "Trésorier",
  member: "Membre du comité",
};

export default function CommitteeManagement() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<CommitteeMember>(
        "/users/?role=committee"
      );

      setMembers(data);
    } catch (err) {
      console.error("Erreur chargement comité :", err);
      setMembers([]);
      setError(
        "Impossible de charger les membres du comité pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return members;

    return members.filter((member) =>
      [
        member.first_name,
        member.last_name,
        member.username,
        member.email,
        member.phone,
      ].some((value) => value?.toLowerCase().includes(query))
    );
  }, [members, search]);

  async function toggleStatus(member: CommitteeMember) {
    setError("");
    setSuccess("");

    try {
      await apiPatch(`/users/${member.id}/`, {
        is_active: !member.is_active,
      });

      setSuccess(
        member.is_active
          ? "Membre du comité désactivé."
          : "Membre du comité activé."
      );

      await loadMembers();
    } catch (err) {
      console.error("Erreur modification :", err);
      setError("Impossible de modifier le statut de ce membre.");
    }
  }

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Organisation du comité
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les comptes des membres du comité.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMembers}
          disabled={loading}
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Membres du comité"
          value={members.length}
        />

        <StatCard
          title="Comptes actifs"
          value={members.filter((m) => m.is_active).length}
        />

        <StatCard
          title="Comptes inactifs"
          value={members.filter((m) => !m.is_active).length}
        />
      </div>

      {/* Recherche */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un membre du comité..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      {/* Liste */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des membres
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredMembers.length} membre(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement des membres...
          </div>
        ) : filteredMembers.length === 0 ? (
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
            <table className="w-full min-w-[750px] text-left text-sm">
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
                {filteredMembers.map((member) => (
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
                        {ROLE_LABELS[member.role] || "Membre du comité"}
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

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(member)}
                        className={`font-semibold hover:underline ${
                          member.is_active
                            ? "text-red-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {member.is_active ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}
