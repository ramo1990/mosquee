"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiGetCurrentUser, apiLogout } from "@/lib/api";
import type { User } from "@/lib/types";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/annonces", label: "Annonces" },
  { href: "/horaires", label: "Horaires" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" },
  { href: "/mosquees", label: "Mosquées" },
];

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {
      // Même si la déconnexion échoue, on ramène vers la connexion.
    }

    setUser(null);
    router.push("/connexion");
    router.refresh();
  }

  return (
    <header className="bg-emerald-800 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="w-fit rounded-sm text-xl font-bold tracking-tight transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Mosquée — Accueil"
          >
            Mosquée CI
          </Link>

          {/* Zone compte sur mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <AccountActions
              user={user}
              loading={loading}
              onLogout={handleLogout}
              compact
            />
          </div>
        </div>

        <nav
          aria-label="Navigation principale"
          className="-mx-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:px-0 lg:pb-0"
        >
          <ul className="flex w-max items-center gap-1 lg:w-auto lg:flex-wrap lg:gap-2">
            {navigation.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-700 hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Zone compte sur desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <AccountActions
            user={user}
            loading={loading}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}

function AccountActions({
  user,
  loading,
  onLogout,
  compact = false,
}: {
  user: User | null;
  loading: boolean;
  onLogout: () => void;
  compact?: boolean;
}) {
  if (loading) {
    return (
      <span className="h-9 w-24 animate-pulse rounded-lg bg-emerald-700/60" />
    );
  }

  if (!user) {
    return (
      <>
        <Link
          href="/connexion"
          className={`rounded-lg border border-white/20 font-semibold text-white transition hover:bg-white/10 ${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
        >
          Connexion
        </Link>

        <Link
          href="/inscription"
          className={`rounded-lg bg-amber-400 font-bold text-emerald-950 transition hover:bg-amber-300 ${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
        >
          Inscription
        </Link>
      </>
    );
  }

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username;

  return (
    <>
      <Link
        href="/compte"
        className={`flex items-center gap-2 rounded-lg bg-white/10 font-semibold text-white transition hover:bg-white/20 ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black"
        >
          {displayName.charAt(0).toUpperCase()}
        </span>

        <span className="max-w-32 truncate">
          {displayName}
        </span>
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className={`rounded-lg border border-white/20 font-semibold text-white transition hover:bg-white/10 ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        Déconnexion
      </button>
    </>
  );
}