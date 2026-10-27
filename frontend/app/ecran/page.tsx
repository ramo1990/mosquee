"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        const data = await apiGetList<Screen>("/ecrans/liste/");

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

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((screen) => (
              <Link
                key={screen.id}
                href={`/ecran/${screen.slug}`}
                className="group rounded-2xl border border-emerald-500/20 bg-emerald-950/50 p-6 transition hover:border-emerald-400 hover:bg-emerald-900/60"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-bold uppercase text-emerald-300">
                    Écran
                  </span>

                  <span className="text-xs text-gray-400">
                    {screen.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold leading-tight">
                  {screen.name}
                </h2>

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
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}