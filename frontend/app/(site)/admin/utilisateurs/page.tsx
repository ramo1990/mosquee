"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiGetUsers, apiDeleteUser } from "@/lib/api";
import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        const data = await apiGetUsers();

        if (!cancelled) {
          setUsers(data);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadUsers() {
    setLoading(true);

    try {
      const data = await apiGetUsers();
      setUsers(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Supprimer définitivement ${user.username} ?`
    );

    if (!confirmed) return;

    try {
      await apiDeleteUser(user.id);
      await loadUsers();
    } catch {
      window.alert("Impossible de supprimer cet utilisateur.");
    }
  }

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.username.toLowerCase().includes(value) ||
      user.first_name.toLowerCase().includes(value) ||
      user.last_name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  return (
    <main className="min-h-dvh bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950">
              Utilisateurs
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Gérez les membres, imams, enseignants et responsables d’écrans.
            </p>
          </div>

          <Link
            href="/admin/utilisateurs/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
          >
            Ajouter un utilisateur
            <span aria-hidden="true">+</span>
          </Link>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="mb-6 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

        {loading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Impossible de charger les utilisateurs.
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center text-sm text-gray-500">
            Aucun utilisateur trouvé.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Utilisateur</th>
                  <th className="px-5 py-3">Rôle</th>
                  <th className="px-5 py-3">Mosquée</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        @{user.username}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {USER_ROLE_LABELS[user.role]}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.mosque || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/utilisateurs/${user.id}`}
                        className="mr-3 font-bold text-emerald-800 hover:underline"
                      >
                        Modifier
                      </Link>

                      <button
                        onClick={() => handleDelete(user)}
                        className="font-bold text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}