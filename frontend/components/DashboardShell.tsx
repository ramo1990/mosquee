
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  Wallet,
  Heart,
  HandCoins,
  CalendarDays,
  Bell,
  Clock,
  BookOpen,
  BookMarked,
  Monitor,
  Settings,
  FileText,
  ClipboardList,
  Megaphone,
  CalendarCheck,
  Presentation,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Landmark,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import { apiGetCurrentUser, apiLogout } from "@/lib/api";
import { getDashboardModules } from "@/lib/permissions";
import type { DashboardModule } from "@/lib/permissions";
import type { User } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";

type MenuItem = {
  module: DashboardModule;
  label: string;
  icon: React.ElementType;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: "Général",
    items: [
      { module: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    title: "Gestion des membres",
    items: [
      { module: "members", label: "Fidèles", icon: Users },
      { module: "committee", label: "Membres du comité", icon: UserCog },
      { module: "imams-teachers", label: "Imams et enseignants", icon: GraduationCap },
    ],
  },
  {
    title: "Finances",
    items: [
      { module: "finance", label: "Finances et rapports", icon: Wallet },
      { module: "contributions", label: "Cotisations", icon: HandCoins },
      { module: "donations", label: "Dons", icon: Heart },
      { module: "expenses", label: "Dépenses", icon: Wallet },
    ],
  },
  {
    title: "Organisation",
    items: [
      { module: "activities", label: "Activités et événements", icon: CalendarDays },
      { module: "tasks", label: "Tâches du comité", icon: ClipboardList },
      { module: "announcements", label: "Annonces", icon: Megaphone },
    ],
  },
  {
    title: "Vie religieuse",
    items: [
      { module: "prayer-times", label: "Horaires de prière", icon: Clock },
      { module: "sermons", label: "Prêches et sermons", icon: BookOpen },
      { module: "religious-announcements", label: "Annonces religieuses", icon: Megaphone },
      { module: "islamic-calendar", label: "Calendrier islamique", icon: CalendarDays },
      { module: "religious-courses", label: "Cours religieux", icon: BookMarked },
      { module: "ramadan", label: "Programme Ramadan", icon: CalendarDays },
      { module: "religious-events", label: "Événements religieux", icon: CalendarCheck },
    ],
  },
  {
    title: "Enseignement",
    items: [
      { module: "classes", label: "Classes", icon: GraduationCap },
      { module: "students", label: "Élèves", icon: Users },
      { module: "courses", label: "Cours", icon: BookOpen },
      { module: "learning-programs", label: "Programmes d'apprentissage", icon: BookMarked },
      { module: "attendance", label: "Présences", icon: ClipboardList },
      { module: "student-progress", label: "Suivi des élèves", icon: GraduationCap },
      { module: "assignments", label: "Devoirs et évaluations", icon: FileText },
      { module: "course-calendar", label: "Calendrier des cours", icon: CalendarDays },
    ],
  },
  {
    title: "Écrans et affichage",
    items: [
      { module: "screens", label: "Écrans d'affichage", icon: Monitor },
      { module: "connected-screens", label: "Écrans connectés", icon: Monitor },
      { module: "slides", label: "Diapositives", icon: Presentation },
      { module: "display-schedule", label: "Programmation", icon: CalendarDays },
      { module: "display-prayer-times", label: "Horaires affichés", icon: Clock },
      { module: "media", label: "Images et vidéos", icon: FileText },
      { module: "screen-preview", label: "Prévisualisation", icon: Monitor },
    ],
  },
  {
    title: "Administration",
    items: [
      { module: "mosque-settings", label: "Paramètres de la mosquée", icon: Building2 },
      { module: "notifications", label: "Notifications", icon: Bell },
      { module: "settings", label: "Paramètres", icon: Settings },
    ],
  },
];

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await apiLogout();
    } catch {
      // On redirige même si la déconnexion API échoue.
    }

    setUser(null);
    router.replace("/connexion");
    router.refresh();
  }

  const modules = user ? getDashboardModules(user.role) : [];

  const groups = MENU_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      modules.includes(item.module)
    ),
  })).filter((group) => group.items.length > 0);

  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") ||
      user.username
    : "";

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-dvh bg-gray-50">

      {/* FOND MOBILE */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      {user && !loading && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* LOGO */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-extrabold text-emerald-900"
            >
              <Landmark size={25} />
              Mosquée<span className="text-amber-500">.</span>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* PROFIL */}
          <div className="shrink-0 border-b border-gray-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-extrabold text-emerald-800">
                {fullName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-xs font-medium text-emerald-700">
                  {USER_ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>

            {user.mosque && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <Building2 size={14} />
                <span className="truncate">{user.mosque}</span>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
            {groups.map((group) => (
              <div key={group.title} className="mb-6">
                <h2 className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400">
                  {group.title}
                </h2>

                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const href =
                      item.module === "dashboard"
                        ? "/dashboard"
                        : `/dashboard/${item.module}`;

                    const active = isActive(href);
                    const Icon = item.icon;

                    return (
                      <li key={item.module}>
                        <Link
                          href={href}
                          onClick={() => setSidebarOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                            active
                              ? "bg-emerald-800 text-white shadow-sm"
                              : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              active
                                ? "text-white"
                                : "text-gray-400 group-hover:text-emerald-700"
                            }
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>

                          {active && <ChevronRight size={15} />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* BAS SIDEBAR */}
          <div className="shrink-0 border-t border-gray-200 p-4">
            <Link
              href="/compte"
              onClick={() => setSidebarOpen(false)}
              className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              <UserRound size={18} />
              Mon profil
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
        </aside>
      )}

      {/* CONTENU PRINCIPAL */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">

        {/* HEADER */}
        {user && !loading && (
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur lg:px-8">

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu size={21} />
              </button>

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900">
                  {USER_ROLE_LABELS[user.role]}
                </p>

                <p className="text-xs text-gray-400">
                  Espace de gestion
                </p>
              </div>
            </div>

            <Link
              href="/compte"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <UserRound size={17} />
              Mon profil
            </Link>
          </header>
        )}

        {/* PAGE */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* CHARGEMENT */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Chargement de votre espace...
            </p>
          </div>
        </div>
      )}

      {/* NON CONNECTÉ */}
      {!loading && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <ShieldCheck size={32} />
            </div>

            <h1 className="mt-5 text-xl font-extrabold text-gray-900">
              Connexion requise
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Connectez-vous pour accéder à votre espace personnel.
            </p>

            <Link
              href="/connexion"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
