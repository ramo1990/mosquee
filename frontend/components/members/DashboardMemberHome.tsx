
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Wallet,
  Heart,
  CalendarDays,
  HandCoins,
  Clock,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  UserRound,
} from "lucide-react";

import { apiGetCurrentUser } from "@/lib/api";
import type { User } from "@/lib/types";

import MemberHeader from "./MemberHeader";
import MemberStatCard from "./MemberStatCard";

export default function DashboardMemberHome() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Chargement...</div>;
  }

  if (!user) {
    return <div className="p-8">Connexion requise.</div>;
  }

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username;

  const shortcuts = [
    {
      title: "Mes cotisations",
      description: "Consultez vos cotisations.",
      icon: Wallet,
      href: "/dashboard/mon-espace/cotisations",
    },
    {
      title: "Mes dons",
      description: "Retrouvez votre historique de dons.",
      icon: Heart,
      href: "/dashboard/mon-espace/dons",
    },
    {
      title: "Mes activités",
      description: "Découvrez les activités de votre mosquée.",
      icon: CalendarDays,
      href: "/dashboard/mon-espace/activites",
    },
    {
      title: "Mon profil",
      description: "Consultez vos informations personnelles.",
      icon: UserRound,
      href: "/compte",
    },
  ];

  return (
    <div className="min-h-screen -m-4 sm:-m-6 lg:-m-8 bg-gray-50">

      <MemberHeader name={fullName} />

      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">

        {/* BIENVENUE */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-7 text-white shadow-lg sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Espace fidèle
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Assalamu alaykum, {user.first_name || user.username} !
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">
            Bienvenue dans votre espace personnel.
            Retrouvez les informations et les activités de votre mosquée.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/compte"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
            >
              Mon profil
            </Link>

            <Link
              href="/dashboard/mon-espace/activites"
              className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Voir les activités
            </Link>
          </div>
        </section>

        {/* INFORMATIONS */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Mon espace
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Retrouvez vos principales informations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MemberStatCard
              title="Mon statut"
              value={user.is_active ? "Actif" : "Inactif"}
              description="Statut de votre compte"
              icon={<UserRound size={23} />}
              color="bg-emerald-100 text-emerald-800"
            />

            <MemberStatCard
              title="Mes cotisations"
              value="À consulter"
              description="Historique de vos cotisations"
              icon={<HandCoins size={23} />}
              color="bg-blue-100 text-blue-800"
            />

            <MemberStatCard
              title="Mes dons"
              value="À consulter"
              description="Historique de vos dons"
              icon={<Heart size={23} />}
              color="bg-rose-100 text-rose-800"
            />
          </div>
        </section>

        {/* RACCOURCIS */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Accès rapide
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Accédez directement à vos services.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {shortcuts.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-800">
                    Consulter
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* VIE DE LA MOSQUEE */}
        <section className="grid gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-800">
                <CalendarCheck size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Vie de la mosquée
                </h3>
                <p className="text-xs text-gray-500">
                  Restez informé des événements.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-600">
              Retrouvez les événements, les rencontres et les activités
              organisés par votre mosquée.
            </p>

            <Link
              href="/dashboard/mon-espace/activites"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
            >
              Découvrir les activités
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-800">
                <BookOpen size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Vie spirituelle
                </h3>
                <p className="text-xs text-gray-500">
                  Cultivez votre connaissance.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-600">
              Consultez les informations religieuses, les cours et les
              annonces de votre mosquée.
            </p>

            <Link
              href="/dashboard/mon-espace/actualites"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
            >
              Découvrir les actualités
              <ArrowRight size={16} />
            </Link>
          </div>

        </section>

        {/* INFORMATIONS COMPTE */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Clock className="text-emerald-800" size={21} />
            <h2 className="font-bold text-gray-900">
              Informations de mon compte
            </h2>
          </div>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-gray-500">Nom complet</p>
              <p className="mt-1 font-semibold text-gray-900">{fullName}</p>
            </div>

            <div>
              <p className="text-gray-500">Adresse email</p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.email || "Non renseignée"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Mosquée</p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.mosque || "Non renseignée"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Membre depuis</p>
              <p className="mt-1 font-semibold text-gray-900">
                {new Date(user.date_joined).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <Link
            href="/compte/modifier"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
          >
            Modifier mes informations
            <ArrowRight size={16} />
          </Link>
        </section>

        <footer className="pb-4 text-center text-xs text-gray-400">
          Votre espace personnel - Mosquée
        </footer>

      </div>
    </div>
  );
}
