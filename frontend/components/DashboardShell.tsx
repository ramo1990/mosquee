
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { apiGetCurrentUser, apiLogout } from "@/lib/api";
import { getDashboardModules } from "@/lib/permissions";
import type { DashboardModule } from "@/lib/permissions";
import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

const MODULE_LABELS: Record<DashboardModule, string> = {
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

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    try {
      await apiLogout();
    } catch {
      // On redirige quand même.
    }

    setUser(null);
    router.push("/connexion");
    router.refresh();
  }

  const modules = user ? getDashboardModules(user.role) : [];

  return (
    <div className="flex min-h-dvh bg-gray-50">

      {/* MENU LATERAL */}
      {user && !loading && (
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link href="/" className="text-lg font-extrabold text-emerald-900">
              Mosquée<span className="text-amber-500">.</span>
            </Link>
          </div>

          <div className="border-b border-gray-200 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              {USER_ROLE_LABELS[user.role]}
            </p>

            <p className="mt-1 truncate font-bold text-gray-900">
              {user.first_name || user.username} {user.last_name}
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {modules.map((module) => {
                const href =
                  module === "dashboard"
                    ? "/dashboard"
                    : `/dashboard/${module}`;

                return (
                  <li key={module}>
                    <Link
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        pathname === href
                          ? "bg-emerald-800 text-white"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                      }`}
                    >
                      {MODULE_LABELS[module]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              Se déconnecter
            </button>
          </div>
        </aside>
      )}

      {/* CONTENU PRINCIPAL : TOUJOURS RENDU */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">

        {user && !loading && (
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 lg:hidden"
            >
              Menu
            </button>

            <p className="hidden text-sm font-semibold text-gray-500 lg:block">
              Espace {USER_ROLE_LABELS[user.role].toLowerCase()}
            </p>

            <Link
              href="/compte"
              className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white"
            >
              Mon profil
            </Link>
          </header>
        )}

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* CHARGEMENT */}
      {loading && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-500">
            Chargement du tableau de bord...
          </p>
        </div>
      )}

      {/* NON CONNECTÉ */}
      {!loading && !user && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-50 px-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              Connexion requise
            </h1>

            <Link
              href="/connexion"
              className="mt-4 inline-block rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
