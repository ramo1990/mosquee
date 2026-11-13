
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  UserRound,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  ShieldCheck,
  Pencil,
  LogOut,
  LayoutDashboard,
  Heart,
  ChevronRight,
} from "lucide-react";

import { apiGetCurrentUser, apiLogout } from "@/lib/api";
import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    apiGetCurrentUser()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await apiLogout();
    } catch {
      // On redirige même si la déconnexion échoue.
    }

    router.replace("/connexion");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="mt-4 text-sm text-gray-500">
            Chargement de votre profil...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto text-emerald-800" size={42} />

          <h1 className="mt-4 text-xl font-extrabold text-gray-900">
            Connexion requise
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous pour consulter votre profil.
          </p>

          <Link
            href="/connexion"
            className="mt-6 inline-flex rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username;

  const isMember = user.role === "member";

  const isManager = [
    "super_admin",
    "mosque_admin",
    "committee",
    "imam",
    "teacher",
    "screen_manager",
  ].includes(user.role);

  const joinedDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Non renseignée";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">

        {/* EN-TÊTE */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Mon compte
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-950">
            Mon profil personnel
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Consultez et gérez les informations de votre compte.
          </p>
        </div>

        {/* CARTE PROFIL */}
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {user.photo ? (
                <Image
                  src={user.photo}
                  alt={fullName}
                  width={100}
                  height={100}
                  unoptimized
                  className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 text-4xl font-black">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-extrabold">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-emerald-100">
                  @{user.username}
                </p>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                  <ShieldCheck size={14} />
                  {USER_ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>
          </div>

          {/* INFORMATIONS */}
          <div className="p-6 sm:p-10">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Informations personnelles
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Les informations associées à votre compte.
                </p>
              </div>

              <Link
                href="/compte/modifier"
                className="flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
              >
                <Pencil size={15} />
                <span className="hidden sm:inline">Modifier</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <InfoCard
                icon={<UserRound size={19} />}
                label="Prénom et nom"
                value={fullName}
              />

              <InfoCard
                icon={<Mail size={19} />}
                label="Adresse email"
                value={user.email || "Non renseignée"}
              />

              <InfoCard
                icon={<Phone size={19} />}
                label="Téléphone"
                value={user.phone || "Non renseigné"}
              />

              <InfoCard
                icon={<Building2 size={19} />}
                label="Mosquée"
                value={user.mosque || "Aucune mosquée associée"}
              />

              <InfoCard
                icon={<CalendarDays size={19} />}
                label="Membre depuis"
                value={joinedDate}
              />

              <InfoCard
                icon={<ShieldCheck size={19} />}
                label="Statut du compte"
                value={user.is_active ? "Compte actif" : "Compte désactivé"}
                success={user.is_active}
              />

            </div>

            {/* ACCÈS RAPIDES */}
            <div className="mt-10">
              <h3 className="mb-4 text-lg font-extrabold text-gray-900">
                Mes espaces
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                {isMember && (
                  <Link
                    href="/espace-fidele"
                    className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white">
                        <Heart size={23} />
                      </div>

                      <div>
                        <p className="font-extrabold text-gray-900">
                          Espace fidèle
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Mes cotisations, dons et activités
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="text-emerald-800 transition group-hover:translate-x-1" />
                  </Link>
                )}

                {isManager && (
                  <Link
                    href="/dashboard"
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white">
                        <LayoutDashboard size={23} />
                      </div>

                      <div>
                        <p className="font-extrabold text-gray-900">
                          Tableau de bord
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Accéder à votre espace de gestion
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="text-emerald-800 transition group-hover:translate-x-1" />
                  </Link>
                )}

              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-between">

              <Link
                href="/"
                className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Retour à l&apos;accueil
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut size={17} />
                {loggingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
  success,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-emerald-800">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {label}
        </span>
      </div>

      <p className={`mt-3 text-sm font-bold ${
        success === undefined
          ? "text-gray-900"
          : success
            ? "text-emerald-700"
            : "text-red-600"
      }`}>
        {value}
      </p>
    </div>
  );
}
