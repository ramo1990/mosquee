
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
          className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}

async function MosquesList() {
  const mosques = await apiGetList<MosqueProfile>("/mosquees/");

  if (mosques.length === 0) {
    return (
      <p className="text-gray-600">
        Aucune mosquée disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mosques.map((mosque) => (
        <Link
          key={mosque.id}
          href={`/mosquees/${mosque.slug}`}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
        >
          {mosque.cover_image ? (
            <div className="relative h-48 w-full">
              <Image
                src={mosque.cover_image}
                alt={`Photo de ${mosque.name}`}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-emerald-50" />
          )}

          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-950">
              {mosque.name}
            </h2>

            {mosque.slogan && (
              <p className="mt-1 text-sm text-emerald-700">
                {mosque.slogan}
              </p>
            )}

            <p className="mt-3 text-sm text-gray-600">
              {mosque.address}, {mosque.city}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function MosquesPage() {
  return (
    <main className="min-h-dvh bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-950">
          Nos mosquées
        </h1>

        <p className="mt-2 text-gray-600">
          Découvrez les différentes mosquées de la communauté.
        </p>

        <div className="mt-8">
          <Suspense fallback={<MosquesSkeleton />}>
            <MosquesList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
