"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiGetCurrentUser } from "@/lib/api";
import { getDashboardModules } from "@/lib/permissions";
import type { DashboardModule } from "@/lib/permissions";
import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

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
};

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Chargement...</p>;
  }

  if (!user) {
    return (
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
    );
  }

  const modules = getDashboardModules(user.role).filter(
    (module) => module !== "dashboard"
  );

  console.log("Rôle utilisateur :", user.role);

  return (
    <div>
      <div className="rounded-3xl bg-linear-to-br from-emerald-800 to-emerald-950 p-8 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
          {USER_ROLE_LABELS[user.role]}
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">
          Bienvenue, {user.first_name || user.username}
        </h1>

        <p className="mt-2 max-w-2xl text-emerald-100">
          Accédez aux outils de gestion et de suivi de votre mosquée.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module}
            href={`/dashboard/${module}`}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-950">
              {LABELS[module]}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Ouvrir le module
            </p>

            <span className="mt-4 inline-block text-sm font-bold text-emerald-700">
              Accéder →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}