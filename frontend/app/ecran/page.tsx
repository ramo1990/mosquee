"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiGetList } from "@/lib/api";
import type { Screen } from "@/lib/types";

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadScreens() {
      try {
        const data = await apiGetList<Screen>("/ecrans/");

        if (active) {
          setScreens(data);
          setError(false);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadScreens();

    return () => {
      active = false;
    };
  }, []);

  const screensByMosque = useMemo(() => {
    const groups = new Map<string, Screen[]>();

    screens.forEach((screen) => {
      const key = screen.mosque ?? "Sans mosquée";

      const current = groups.get(key) ?? [];

      current.push(screen);

      groups.set(key, current);
    });

    return Array.from(groups.entries());
  }, [screens]);

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
            Mosquée
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Choisissez un écran
          </h1>

          <p className="mt-2 text-gray-400">
            Sélectionnez l’écran à afficher sur le téléviseur.
          </p>
        </header>

        {loading ? (
          <p className="text-center text-gray-300">
            Chargement des écrans...
          </p>
        ) : error ? (
          <p className="text-center text-red-400">
            Impossible de charger la liste des écrans.
          </p>
        ) : screens.length === 0 ? (
          <p className="text-center text-gray-300">
            Aucun écran actif n’est disponible.
          </p>
        ) : (
          <div className="space-y-10">
            {screensByMosque.map(([mosqueSlug, mosqueScreens]) => (
              <section key={mosqueSlug}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-emerald-300">
                    {mosqueSlug}
                  </h2>

                  <Link
                    href={`/mosquees/${mosqueSlug}`}
                    className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Voir la mosquée →
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mosqueScreens.map((screen) => (
                    <Link
                      key={screen.id}
                      href={`/ecran/${screen.slug}`}
                      className="group rounded-2xl border border-emerald-500/20 bg-emerald-950/50 p-6 transition hover:border-emerald-400 hover:bg-emerald-900/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
                          Écran
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            screen.is_online
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {screen.is_online
                            ? "En ligne"
                            : "Hors ligne"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-tight">
                        {screen.name}
                      </h3>

                      {screen.location && (
                        <p className="mt-1 text-sm text-gray-400">
                          {screen.location}
                        </p>
                      )}

                      <p className="mt-4 font-mono text-xs text-gray-500">
                        /ecran/{screen.slug}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                        Ouvrir l’affichage
                        <span
                          aria-hidden="true"
                          className="transition group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}