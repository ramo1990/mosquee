
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { apiGet, apiGetList } from "@/lib/api";
import type { MosqueProfile, Screen } from "@/lib/types";

function ScreensSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Chargement des écrans"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#f7faf7] p-6"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="mt-6 h-5 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
          <div className="mt-8 h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyScreens() {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-900/20 bg-[#f7faf7] px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4M7 9h10M7 12h6" />
        </svg>
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-950">
        Aucun écran disponible
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
        Aucun écran n’est actuellement associé à cette mosquée.
        Les écrans configurés apparaîtront ici.
      </p>
    </div>
  );
}

async function MosqueScreens({ slug }: { slug: string }) {
  const screens = await apiGetList<Screen>(
    `/ecrans/mosquee/${slug}/`
  );

  if (screens.length === 0) {
    return <EmptyScreens />;
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Sélectionnez un écran pour ouvrir son affichage.
        </p>

        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          {screens.length} écran{screens.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {screens.map((screen) => (
          <Link
            key={screen.id}
            href={`/mosquees/${slug}/ecrans/${screen.slug}`}
            className="group flex min-h-60 flex-col rounded-2xl border border-emerald-900/10 bg-[#f7faf7] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-600/40 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="13" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  screen.is_online
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    screen.is_online
                      ? "bg-emerald-500"
                      : "bg-gray-400"
                  }`}
                  aria-hidden="true"
                />
                {screen.is_online ? "En ligne" : "Hors ligne"}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-bold text-gray-950 transition group-hover:text-emerald-800">
                {screen.name}
              </h2>

              {screen.location ? (
                <p className="mt-2 flex items-start gap-2 text-sm leading-5 text-gray-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {screen.location}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-400">
                  Emplacement non renseigné
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <span className="text-sm font-semibold text-emerald-800">
                Ouvrir l’affichage
              </span>

              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition group-hover:translate-x-1 group-hover:bg-emerald-700 group-hover:text-white"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

async function MosqueScreensPageContent({
  slug,
}: {
  slug: string;
}) {
  const mosque = await apiGet<MosqueProfile>(
    `/mosquees/${slug}/`
  ).catch(() => null);

  if (!mosque) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[#eef3ef]">
      <div className="border-b border-emerald-900/10 bg-[#e3ece5]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
          <Link
            href={`/mosquees/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
          >
            <span aria-hidden="true">←</span>
            Retour à {mosque.name}
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                Espace d’affichage
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                Les écrans de la mosquée
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                Retrouvez les écrans de{" "}
                <span className="font-semibold text-gray-900">
                  {mosque.name}
                </span>{" "}
                et ouvrez leur affichage pour consulter les horaires
                de prière, les annonces et les informations de la communauté.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="13" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-700">
                  Mosquée sélectionnée
                </p>
                <p className="max-w-48 truncate text-sm font-bold text-emerald-950">
                  {mosque.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<ScreensSkeleton />}>
          <MosqueScreens slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}

export default function MosqueScreensPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ScreensSkeleton />}>
      <MosqueScreensPageParams params={params} />
    </Suspense>
  );
}

async function MosqueScreensPageParams({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <MosqueScreensPageContent slug={slug} />;
}
