
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGetList,
  apiPatch,
} from "@/lib/api";

type StaffRole = "imam" | "teacher";

type StaffMember = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: StaffRole;
  is_active: boolean;
  mosque?: number | null;
};

const ROLE_LABELS: Record<StaffRole, string> = {
  imam: "Imam",
  teacher: "Enseignant",
};

export default function ImamsTeachersManagement() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [imams, teachers] = await Promise.all([
        apiGetList<StaffMember>("/users/?role=imam"),
        apiGetList<StaffMember>("/users/?role=teacher"),
      ]);

      setMembers([...imams, ...teachers]);
    } catch (err) {
      console.error("Erreur chargement des imams et enseignants :", err);
      setMembers([]);
      setError(
        "Impossible de charger les imams et enseignants pour le moment."
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

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        [
          member.first_name,
          member.last_name,
          member.username,
          member.email,
          member.phone,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const imamCount = members.filter(
    (member) => member.role === "imam"
  ).length;

  const teacherCount = members.filter(
    (member) => member.role === "teacher"
  ).length;

  const activeCount = members.filter(
    (member) => member.is_active
  ).length;

  async function toggleStatus(member: StaffMember) {
    setError("");
    setSuccess("");

    try {
      await apiPatch(`/users/${member.id}/`, {
        is_active: !member.is_active,
      });

      setSuccess(
        member.is_active
          ? "Compte désactivé avec succès."
          : "Compte activé avec succès."
      );

      await loadMembers();
    } catch (err) {
      console.error("Erreur modification du compte :", err);
      setError("Impossible de modifier le statut de ce compte.");
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
            Gestion des imams et enseignants
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les responsables religieux et pédagogiques.
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={members.length} />
        <StatCard title="Imams" value={imamCount} />
        <StatCard title="Enseignants" value={teacherCount} />
        <StatCard title="Comptes actifs" value={activeCount} />
      </div>

      {/* Filtres */}
      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un imam ou enseignant..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les profils</option>
          <option value="imam">Imams</option>
          <option value="teacher">Enseignants</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des imams et enseignants
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredMembers.length} personne(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredMembers.length === 0 ? (
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
                          onClick={() => toggleStatus(member)}
                          className={`font-semibold hover:underline ${
                            member.is_active
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {member.is_active ? "Désactiver" : "Activer"}
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
