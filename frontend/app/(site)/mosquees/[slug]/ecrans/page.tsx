import { Suspense } from "react";
import Link from "next/link";

import { apiGetList } from "@/lib/api";
import type { Screen } from "@/lib/types";


function ScreensSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-2xl bg-gray-200"
        />
      ))}
    </div>
  );
}


async function MosqueScreens({ slug }: { slug: string }) {
  const screens = await apiGetList<Screen>(
    `/ecrans/mosquee/${slug}/`
  );

  if (screens.length === 0) {
    return (
      <p className="text-gray-600">
        Aucun écran actif pour cette mosquée.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {screens.map((screen) => (
        <Link
          key={screen.id}
          href={`/ecran/${screen.slug}`}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-700">
              Écran
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                screen.is_online
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {screen.is_online ? "En ligne" : "Hors ligne"}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-950">
            {screen.name}
          </h2>

          {screen.location && (
            <p className="mt-1 text-sm text-gray-600">
              {screen.location}
            </p>
          )}

          <p className="mt-4 font-mono text-xs text-gray-500">
            /ecran/{screen.slug}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Ouvrir l’affichage
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}


export default function MosqueScreensPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ScreensSkeleton />}>
      <MosqueScreensPageContent params={params} />
    </Suspense>
  );
}


async function MosqueScreensPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-dvh bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/mosquees/${slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Retour à la mosquée
        </Link>

        <h1 className="text-4xl font-bold text-gray-950">
          Écrans de la mosquée
        </h1>

        <p className="mt-2 text-gray-600">
          Sélectionnez un écran pour ouvrir son affichage.
        </p>

        <div className="mt-8">
          <Suspense fallback={<ScreensSkeleton />}>
            <MosqueScreens slug={slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}