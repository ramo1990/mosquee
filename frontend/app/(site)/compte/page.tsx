"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";
import { useRouter } from "next/navigation";
import { apiGetCurrentUser, apiPost } from "@/lib/api";
import Image from "next/image";


export default function AccountPage() {
      const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Chargement du profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Vous n’êtes pas connecté
          </h1>

          <Link
            href="/connexion"
            className="mt-4 inline-block rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ") || user.username;


    async function handleLogout() {
        await apiPost("/auth/logout/");
        router.push("/connexion");
    }

  return (
    <main className="min-h-dvh bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {user.photo ? (
                <Image
                    src={user.photo}
                    alt={fullName}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-2xl object-cover"
                    unoptimized
                />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-100 text-3xl font-black text-emerald-800">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-gray-950">
                {fullName}
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                @{user.username}
              </p>

              <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {USER_ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {user.email || "Non renseigné"}
              </dd>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Téléphone
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {user.phone || "Non renseigné"}
              </dd>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Mosquée
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {user.mosque || "Aucune mosquée"}
              </dd>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Membre depuis
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {new Date(user.date_joined).toLocaleDateString("fr-FR")}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/compte/modifier"
              className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
            >
              Modifier mon profil
            </Link>

            {["super_admin", "mosque_admin"].includes(user.role) && (
              <Link
                href="/admin/utilisateurs"
                className="rounded-xl border border-emerald-200 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
              >
                Gérer les utilisateurs
              </Link>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
            Se déconnecter
            </button>

        </div>
      </div>
    </main>
  );
}