
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { apiGetList } from "@/lib/api";
import type { MosqueProfile } from "@/lib/types";

function MosquesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
        >
          <div className="h-56 animate-pulse bg-gray-200" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MosqueCard({ mosque }: { mosque: MosqueProfile }) {
  const location = [mosque.city, mosque.address]
    .filter((value) => value?.trim())
    .join(" · ");

  return (
    <Link
      href={`/mosquees/${mosque.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
    >
      <div className="relative h-56 overflow-hidden bg-emerald-950">
        {mosque.cover_image ? (
          <Image
            src={mosque.cover_image}
            alt={`Photo de ${mosque.name}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-950">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="h-20 w-20 text-emerald-100/70"
              aria-hidden="true"
            >
              <path
                d="M12 52V30L32 17L52 30V52H12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M25 52V39C25 35 28 32 32 32C36 32 39 35 39 39V52M8 52H56M32 17V8M29 11H35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 30V22L21 19M47 30V22L43 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/10 to-transparent" />

        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Lieu de culte
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Notre communauté
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-white">
            {mosque.name}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {mosque.slogan ? (
          <p className="line-clamp-2 text-sm font-medium leading-6 text-emerald-800">
            {mosque.slogan}
          </p>
        ) : (
          <p className="text-sm leading-6 text-gray-500">
            Bienvenue dans notre communauté.
          </p>
        )}

        <div className="mt-4 flex items-start gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
            aria-hidden="true"
          >
            <path
              d="M20 10C20 15 12 22 12 22S4 15 4 10A8 8 0 1 1 20 10Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="10"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>

          <p className="text-sm leading-6 text-gray-600">
            {location || "Localisation non renseignée"}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-800">
            Découvrir la mosquée
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition duration-300 group-hover:bg-emerald-700 group-hover:text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path
                d="M5 12H19M12 5L19 12L12 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

async function MosquesList() {
  const mosques = await apiGetList<MosqueProfile>("/mosquees/");

  if (mosques.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              d="M3 21H21M5 21V10L12 5L19 10V21M9 21V15H15V21M12 2V5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-950">
          Aucune mosquée pour le moment
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
          Les mosquées disponibles apparaîtront ici dès qu&apos;elles auront été ajoutées.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Retrouvez les lieux de culte de notre communauté.
        </p>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
          {mosques.length} {mosques.length > 1 ? "mosquées" : "mosquée"}
        </span>
      </div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mosques.map((mosque) => (
          <MosqueCard key={mosque.id} mosque={mosque} />
        ))}
      </div>
    </>
  );
}

export default function MosquesPage() {
  return (
    <main className="min-h-dvh bg-[#f7f9f7]">
      <section className="relative isolate overflow-hidden bg-[#082c22]">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Foi · Paix · Fraternité
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Nos mosquées,
              <span className="mt-2 block text-emerald-300">
                au cœur de la communauté.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/80 sm:text-lg sm:leading-8">
              Découvrez nos lieux de prière, leurs actualités et les
              communautés qui les font vivre au quotidien.
            </p>

            <a
              href="#liste-mosquees"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-black/10 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Explorer les mosquées
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div
            aria-hidden="true"
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-emerald-100/70"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-300">✦</span>
              Des lieux de spiritualité
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-300">✦</span>
              Une communauté unie
            </span>
          </div>
        </div>
      </section>

      <section
        id="liste-mosquees"
        className="scroll-mt-8 px-6 py-12 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Découvrez nos lieux de culte
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Une communauté, plusieurs mosquées
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Sélectionnez une mosquée pour consulter ses informations,
              ses horaires de prière et ses écrans d&apos;affichage.
            </p>
          </div>

          <Suspense fallback={<MosquesSkeleton />}>
            <MosquesList />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
