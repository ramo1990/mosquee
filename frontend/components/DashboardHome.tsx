
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiGetCurrentUser } from "@/lib/api";
import {
  getDashboardModules,
  type DashboardModule,
} from "@/lib/permissions";

import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

import {
  LayoutDashboard,
  Users,
  Wallet,
  Heart,
  CalendarDays,
  Bell,
  Clock,
  BookOpen,
  GraduationCap,
  Monitor,
  Settings,
  FileText,
  ClipboardList,
  Megaphone,
  HandCoins,
  UserRound,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookMarked,
  CalendarCheck,
  Presentation,
} from "lucide-react";

type DashboardCard = {
  module: DashboardModule;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

const LABELS: Record<DashboardModule, string> = {
  dashboard: "Tableau de bord",
  members: "Fidèles",
  committee: "Membres du comité",
  "imams-teachers": "Imams et enseignants",
  contributions: "Cotisations",
  donations: "Dons",
  expenses: "Dépenses",
  finance: "Finances et rapports",
  activities: "Activités et événements",
  announcements: "Annonces",
  screens: "Écrans d’affichage",
  "mosque-settings": "Paramètres de la mosquée",
  tasks: "Tâches du comité",
  "prayer-times": "Horaires de prière",
  sermons: "Prêches et sermons",
  "religious-announcements": "Annonces religieuses",
  "islamic-calendar": "Calendrier islamique",
  "religious-courses": "Cours religieux",
  ramadan: "Programme Ramadan",
  "religious-events": "Événements religieux",
  classes: "Classes",
  students: "Élèves",
  courses: "Cours",
  "learning-programs": "Programmes d’apprentissage",
  attendance: "Présences",
  "student-progress": "Suivi des élèves",
  assignments: "Devoirs et évaluations",
  "course-calendar": "Calendrier des cours",
  "connected-screens": "Écrans connectés",
  slides: "Diapositives",
  "display-schedule": "Programmation des affichages",
  "display-prayer-times": "Horaires de prière affichés",
  media: "Images et vidéos",
  "screen-preview": "Prévisualisation des écrans",
  notifications: "Notifications",
  settings: "Paramètres",

  "my-donations": "Mes dons",
  "my-contributions": "Mes cotisations",
  "my-activities": "Mes activités",
  "my-profile": "Mon profil",
};

const ICONS: Partial<Record<DashboardModule, React.ElementType>> = {
  members: Users,
  committee: Users,
  "imams-teachers": GraduationCap,
  contributions: Wallet,
  donations: Heart,
  expenses: HandCoins,
  finance: Wallet,
  activities: CalendarDays,
  announcements: Megaphone,
  screens: Monitor,
  "mosque-settings": Settings,
  tasks: ClipboardList,
  "prayer-times": Clock,
  sermons: BookOpen,
  "religious-announcements": Megaphone,
  "islamic-calendar": CalendarDays,
  "religious-courses": BookMarked,
  ramadan: CalendarDays,
  "religious-events": CalendarCheck,
  classes: GraduationCap,
  students: Users,
  courses: BookOpen,
  "learning-programs": BookMarked,
  attendance: ClipboardList,
  "student-progress": GraduationCap,
  assignments: FileText,
  "course-calendar": CalendarDays,
  "connected-screens": Monitor,
  slides: Presentation,
  "display-schedule": CalendarDays,
  "display-prayer-times": Clock,
  media: FileText,
  "screen-preview": Monitor,
  notifications: Bell,
  settings: Settings,
  "my-donations": Heart,
  "my-contributions": Wallet,
  "my-activities": CalendarDays,
  "my-profile": UserRound,
};

const ROLE_CONTENT = {
  super_admin: {
    title: "Administration générale",
    description: "Pilotez et supervisez votre plateforme de gestion des mosquées.",
    greeting: "Bienvenue dans votre espace d'administration.",
  },
  mosque_admin: {
    title: "Gestion de votre mosquée",
    description: "Retrouvez tous les outils nécessaires à la gestion de votre mosquée.",
    greeting: "Bienvenue dans votre espace de gestion.",
  },
  committee: {
    title: "Espace du comité",
    description: "Organisez les activités et participez à la gestion de votre mosquée.",
    greeting: "Bienvenue dans votre espace du comité.",
  },
  imam: {
    title: "Espace de l'imam",
    description: "Retrouvez les outils pour organiser et suivre les activités religieuses.",
    greeting: "Bienvenue dans votre espace religieux.",
  },
  teacher: {
    title: "Espace enseignant",
    description: "Organisez vos cours et accompagnez vos élèves.",
    greeting: "Bienvenue dans votre espace pédagogique.",
  },
  screen_manager: {
    title: "Gestion des affichages",
    description: "Gérez les écrans et les contenus diffusés dans votre mosquée.",
    greeting: "Bienvenue dans votre espace de gestion des écrans.",
  },
  member: {
    title: "Mon espace personnel",
    description: "Retrouvez les informations et les activités de votre mosquée.",
    greeting: "Bienvenue dans votre espace personnel.",
  },
};

const ROLE_CARDS: Record<string, DashboardModule[]> = {
  super_admin: [
    "members",
    "committee",
    "imams-teachers",
    "finance",
    "activities",
    "mosque-settings",
  ],
  mosque_admin: [
    "members",
    "committee",
    "imams-teachers",
    "finance",
    "activities",
    "mosque-settings",
  ],
  committee: [
    "members",
    "contributions",
    "donations",
    "expenses",
    "activities",
    "tasks",
  ],
  imam: [
    "prayer-times",
    "sermons",
    "religious-announcements",
    "islamic-calendar",
    "religious-courses",
    "religious-events",
  ],
  teacher: [
    "classes",
    "students",
    "courses",
    "learning-programs",
    "attendance",
    "assignments",
  ],
  screen_manager: [
    "connected-screens",
    "announcements",
    "slides",
    "display-schedule",
    "media",
    "screen-preview",
  ],
  member: [
    "my-profile",
    "my-donations",
    "my-contributions",
    "my-activities",
    "prayer-times",
    "islamic-calendar",
  ],
};

export default function DashboardHome() {
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
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-gray-500">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Vous n&apos;êtes pas connecté
        </h1>

        <Link
          href="/connexion"
          className="mt-4 inline-block rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  const role = user.role;
  const content = ROLE_CONTENT[role];
  const allowedModules = getDashboardModules(role);

  const cards: DashboardCard[] = (ROLE_CARDS[role] ?? [])
    .filter((module) => allowedModules.includes(module))
    .map((module) => ({
      module,
      title: LABELS[module],
      description: `Accéder à ${LABELS[module].toLowerCase()}.`,
      icon: ICONS[module] ?? LayoutDashboard,
      color: "emerald",
    }));

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username;

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ACCUEIL */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-7 text-white shadow-lg sm:p-10">

        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <ShieldCheck size={17} />
            {USER_ROLE_LABELS[role]}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Assalamu alaykum, {displayName} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100 sm:text-base">
            {content.greeting}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user.mosque && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
                <Building2 size={15} />
                {user.mosque}
              </span>
            )}

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
              {USER_ROLE_LABELS[role]}
            </span>
          </div>
        </div>
      </section>

      {/* TITRE */}
      <section>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-950">
              {content.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {content.description}
            </p>
          </div>

          <Link
            href="/compte"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950"
          >
            Mon profil
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* RACCOURCIS */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">
            Accès rapides
          </h2>

          <span className="text-xs text-gray-400">
            {cards.length} fonctionnalités
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            const href =
              card.module === "my-profile"
                ? "/compte"
                : `/dashboard/${card.module}`;

            return (
              <Link
                key={card.module}
                href={href}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
                  />
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* INFORMATIONS */}
      {role === "member" && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800">
              <Heart size={22} />
            </div>

            <div>
              <h3 className="font-bold text-emerald-950">
                La vie de votre mosquée
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-900/75">
                Retrouvez les horaires de prière, les annonces et les
                événements pour rester informé de la vie de votre communauté.
              </p>

              <Link
                href="/dashboard/announcements"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-900 hover:underline"
              >
                Consulter les annonces
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* INFORMATIONS PROFIL */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <UserRound size={21} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Mon compte
            </h3>

            <p className="text-sm text-gray-500">
              Gérez vos informations personnelles.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-400">
              Nom d&apos;utilisateur
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {user.username}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-400">
              Email
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-900">
              {user.email || "Non renseigné"}
            </p>
          </div>
        </div>

        <Link
          href="/compte"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
        >
          Consulter mon compte
          <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  );
}
