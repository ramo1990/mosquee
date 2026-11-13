
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Clock,
  CalendarDays,
  Heart,
  Newspaper,
  HandHeart,
  ChevronRight,
  Bell,
  BookOpen,
  CalendarCheck,
  Loader2,
  MapPin,
} from "lucide-react";

import { apiGetCurrentUser } from "@/lib/api";
import type { User } from "@/lib/types";

const PRAYER_TIMES = [
  { name: "Fajr", time: "05:45" },
  { name: "Dhuhr", time: "13:15" },
  { name: "Asr", time: "16:30" },
  { name: "Maghrib", time: "18:05" },
  { name: "Isha", time: "19:30" },
];

const QUICK_LINKS = [
  {
    title: "Horaires de prière",
    description: "Consulter les horaires quotidiens",
    href: "/horaires",
    icon: Clock,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Actualités",
    description: "Les dernières nouvelles de la mosquée",
    href: "/actualites",
    icon: Newspaper,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Événements",
    description: "Découvrir les activités à venir",
    href: "/evenements",
    icon: CalendarDays,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Faire un don",
    description: "Soutenir les projets de la mosquée",
    href: "/dons",
    icon: HandHeart,
    color: "bg-rose-100 text-rose-700",
  },
];

const DEMO_NEWS = [
  {
    id: 1,
    title: "Bienvenue dans votre espace fidèle",
    description:
      "Retrouvez ici les informations importantes de votre mosquée.",
    date: "Actualité",
  },
  {
    id: 2,
    title: "Suivez les activités de votre mosquée",
    description:
      "Consultez régulièrement les annonces et les événements.",
    date: "Information",
  },
];

const DEMO_EVENTS = [
  {
    id: 1,
    title: "Cours religieux",
    date: "Consultez le programme",
    location: "Mosquée",
  },
  {
    id: 2,
    title: "Activités communautaires",
    date: "À venir",
    location: "Mosquée",
  },
];

export default function EspaceFidelePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <UserRound className="mx-auto h-12 w-12 text-emerald-700" />

          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            Connexion requise
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Connectez-vous pour accéder à votre espace personnel de fidèle.
          </p>

          <Link
            href="/connexion"
            className="mt-6 inline-flex rounded-xl bg-emerald-800 px-6 py-3 font-bold text-white hover:bg-emerald-900"
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

  const firstName = user.first_name || user.username;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* BIENVENUE */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-7 text-white shadow-lg sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold text-emerald-200">
              Mon espace fidèle
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Assalamu alaykum, {firstName} !
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base">
              Bienvenue dans votre espace personnel.
              Retrouvez toutes les informations et activités
              de votre mosquée en un seul endroit.
            </p>

            <Link
              href="/compte"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
            >
              Mon profil
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[30px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full border-[25px] border-white/5" />
        </section>

        {/* PROFIL */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <UserRound size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500">
                  Mon compte
                </p>
                <p className="truncate font-bold text-gray-900">
                  {fullName}
                </p>
              </div>
            </div>

            <Link
              href="/compte"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900"
            >
              Voir mon profil <ChevronRight size={15} />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <MapPin size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500">
                  Ma mosquée
                </p>
                <p className="truncate font-bold text-gray-900">
                  {user.mosque || "Non renseignée"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Votre communauté
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <CalendarCheck size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Membre depuis
                </p>
                <p className="font-bold text-gray-900">
                  {new Date(user.date_joined).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Heureux de vous compter parmi nous
            </p>
          </div>
        </section>

        {/* ACCÈS RAPIDES */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Que souhaitez-vous consulter ?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Accédez rapidement aux services de votre mosquée.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm font-bold text-emerald-700">
                    Consulter
                    <ChevronRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* HORAIRES */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="text-emerald-700" size={21} />
                <h2 className="text-lg font-extrabold text-gray-900">
                  Horaires de prière
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Exemple d&apos;affichage des horaires
              </p>
            </div>

            <Link
              href="/horaires"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-900"
            >
              Tout voir
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PRAYER_TIMES.map((prayer) => (
              <div
                key={prayer.name}
                className="rounded-xl bg-gray-50 p-4 text-center"
              >
                <p className="text-sm font-semibold text-gray-500">
                  {prayer.name}
                </p>
                <p className="mt-2 text-xl font-extrabold text-emerald-900">
                  {prayer.time}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ACTUALITÉS ET ÉVÉNEMENTS */}
        <section className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="text-emerald-700" size={21} />
                <h2 className="text-lg font-extrabold text-gray-900">
                  Actualités
                </h2>
              </div>

              <Link
                href="/actualites"
                className="text-sm font-bold text-emerald-700"
              >
                Voir tout
              </Link>
            </div>

            <div className="space-y-4">
              {DEMO_NEWS.map((news) => (
                <div
                  key={news.id}
                  className="rounded-xl bg-gray-50 p-4"
                >
                  <span className="text-xs font-bold uppercase text-emerald-700">
                    {news.date}
                  </span>

                  <h3 className="mt-2 font-bold text-gray-900">
                    {news.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {news.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-amber-600" size={21} />
                <h2 className="text-lg font-extrabold text-gray-900">
                  Événements
                </h2>
              </div>

              <Link
                href="/evenements"
                className="text-sm font-bold text-emerald-700"
              >
                Voir tout
              </Link>
            </div>

            <div className="space-y-4">
              {DEMO_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 rounded-xl bg-gray-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      {event.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {event.date}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DON */}
        <section className="overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Heart size={25} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Soutenez votre mosquée
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                  Chaque contribution aide à financer les projets,
                  les activités et l&apos;entretien de votre mosquée.
                </p>
              </div>
            </div>

            <Link
              href="/dons"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-800"
            >
              Faire un don
              <ChevronRight size={17} />
            </Link>
          </div>
        </section>

        {/* PROFIL */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <BookOpen size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Vos informations personnelles
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Consultez et modifiez les informations de votre compte.
              </p>
            </div>
          </div>

          <Link
            href="/compte"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            Gérer mon profil
            <ChevronRight size={17} />
          </Link>
        </section>

      </div>
    </main>
  );
}