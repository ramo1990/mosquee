
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiGetList } from "@/lib/api";
import type { MosqueProfile } from "@/lib/types";
import {
  Search,
  MapPin,
  ArrowRight,
  Moon,
  Loader2,
  Building2,
  Heart,
  Clock,
  CalendarDays,
  X,
} from "lucide-react";

function MosqueCard({ mosque }: { mosque: MosqueProfile }) {
  const location = [mosque.address, mosque.city]
    .filter((value) => value?.trim())
    .join(", ");

  return (
    <Link
      href={`/mosquees/${mosque.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
    >
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-950">
        {mosque.cover_image ? (
          <Image
            src={mosque.cover_image}
            alt={`Photo de ${mosque.name}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Moon className="h-20 w-20 text-emerald-100/70" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Lieu de culte
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Notre communauté
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            {mosque.name}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="line-clamp-2 min-h-10 text-sm leading-6 text-gray-600">
          {mosque.slogan || "Bienvenue dans notre communauté."}
        </p>

        <div className="mt-5 flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <p className="text-sm leading-6 text-gray-600">
            {location || "Localisation non renseignée"}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5 mt-6">
          <span className="text-sm font-bold text-gray-900">
            Découvrir la mosquée
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
            <ArrowRight size={19} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MosquesPage() {
  const [mosques, setMosques] = useState<MosqueProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiGetList<MosqueProfile>("/mosquees/")
      .then((data) => {
        if (active) setMosques(data);
      })
      .catch(() => {
        if (active) {
          setError("Impossible de charger les mosquées. Veuillez réessayer.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredMosques = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");

    if (!query) return mosques;

    return mosques.filter((mosque) => {
      const searchable = [
        mosque.name,
        mosque.city,
        mosque.address,
        mosque.slogan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("fr");

      return searchable.includes(query);
    });
  }, [mosques, search]);

  return (
    <main className="min-h-dvh bg-[#f7f9f7]">

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#062b20] via-emerald-900 to-[#075c42]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-100">
              <Moon size={15} />
              Foi · Paix · Fraternité
            </span>

            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Nos mosquées,
              <span className="mt-2 block text-emerald-300">
                au cœur de notre communauté.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-50/80 sm:text-lg">
              Découvrez les lieux de prière, les communautés et les
              activités qui font vivre nos mosquées au quotidien.
            </p>

            <a
              href="#liste-mosquees"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-6 py-3 font-bold text-emerald-950 transition hover:bg-emerald-50"
            >
              Explorer les mosquées
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-4 border-t border-white/15 pt-7 sm:grid-cols-3">
            <div>
              <Building2 className="text-emerald-300" size={23} />
              <p className="mt-3 text-sm font-semibold text-white">
                Lieux de culte
              </p>
            </div>

            <div>
              <Heart className="text-emerald-300" size={23} />
              <p className="mt-3 text-sm font-semibold text-white">
                Solidarité
              </p>
            </div>

            <div>
              <Moon className="text-emerald-300" size={23} />
              <p className="mt-3 text-sm font-semibold text-white">
                Spiritualité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LISTE */}
      <section
        id="liste-mosquees"
        className="scroll-mt-8 px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                Découvrez nos lieux de culte
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Nos mosquées
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                Retrouvez les informations de chaque mosquée et
                découvrez les services proposés à la communauté.
              </p>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-3 shadow-sm">
                <Building2 className="text-emerald-700" size={23} />
                <div>
                  <p className="text-xl font-extrabold text-gray-950">
                    {mosques.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mosques.length > 1 ? "Mosquées disponibles" : "Mosquée disponible"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RECHERCHE */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3 px-2">
              <Search className="shrink-0 text-emerald-700" size={21} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom, ville ou adresse..."
                className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                aria-label="Rechercher une mosquée"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Effacer la recherche"
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* CHARGEMENT */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-emerald-700" />
            </div>
          )}

          {/* ERREUR */}
          {!loading && error && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-bold text-red-800">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* RÉSULTATS */}
          {!loading && !error && filteredMosques.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  {filteredMosques.length} résultat(s)
                </p>
              </div>

              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMosques.map((mosque) => (
                  <MosqueCard key={mosque.id} mosque={mosque} />
                ))}
              </div>
            </>
          )}

          {/* AUCUN RÉSULTAT */}
          {!loading && !error && filteredMosques.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Search size={30} />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-gray-950">
                Aucune mosquée trouvée
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Essayez un autre nom ou une autre ville.
              </p>

              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-5 pb-14 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 to-emerald-800 p-7 text-white sm:p-10">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
                Votre communauté
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Restez connecté à la vie de votre mosquée.
              </h2>

              <p className="mt-3 text-sm leading-7 text-emerald-100/80">
                Consultez les horaires de prière, les annonces et
                les événements pour ne rien manquer.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/horaires"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-emerald-50"
              >
                <Clock size={17} />
                Horaires
              </Link>

              <Link
                href="/evenements"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                <CalendarDays size={17} />
                Événements
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}