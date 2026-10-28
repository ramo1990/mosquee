import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import AnnouncementsList from "@/components/AnnouncementsList";
import PrayerTimesToday from "@/components/PrayerTimesToday";
import UpcomingEvents, {
  EventsSkeleton,
} from "@/components/UpcomingEvents";

import { apiGetList } from "@/lib/api";
import type {
  GalleryAlbum,
  MosqueProfile,
  NewsArticle,
} from "@/lib/types";


function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}


function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <div
      role="status"
      aria-label="Chargement du contenu"
      className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-5"
    >
      <span className="sr-only">Chargement en cours...</span>

      <div className="mb-4 h-4 w-1/3 rounded bg-gray-200" />

      <div className="space-y-3">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className="h-3 rounded bg-gray-200"
            style={{ width: `${100 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}


function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-12 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-12 -z-10 h-52 w-52 rounded-full border border-white/10 sm:h-72 sm:w-72"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-50 sm:text-sm">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-300"
          />
          Bienvenue dans notre communauté
        </span>

        <h1
          id="hero-title"
          className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          Une communauté de foi,
          <span className="block text-emerald-200">
            unie dans la prière et le partage.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/90 sm:text-lg sm:leading-8">
          Retrouvez les mosquées de la communauté, leurs horaires de
          prière, leurs annonces, leurs événements et leurs activités.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mosquees"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Découvrir les mosquées
            <span aria-hidden="true">→</span>
          </Link>

          <Link
            href="/horaires"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Consulter les horaires
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-sm text-emerald-100/90">
          <span>☪ Spiritualité</span>
          <span>◇ Fraternité</span>
          <span>♡ Solidarité</span>
        </div>
      </div>
    </section>
  );
}


async function FeaturedMosques() {
  const mosques = await apiGetList<MosqueProfile>("/mosquees/");

  const featured = mosques.slice(0, 3);

  if (featured.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucune mosquée n’est encore enregistrée.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((mosque) => (
        <Link
          key={mosque.id}
          href={`/mosquees/${mosque.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
        >
          {mosque.cover_image ? (
            <div className="relative h-44 w-full">
              <Image
                src={mosque.cover_image}
                alt={mosque.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-44 w-full bg-emerald-50" />
          )}

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-950">
              {mosque.name}
            </h3>

            {mosque.slogan && (
              <p className="mt-1 text-sm text-emerald-700">
                {mosque.slogan}
              </p>
            )}

            <p className="mt-3 text-sm text-gray-600">
              {mosque.address}, {mosque.city}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              Voir la mosquée
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}


async function LatestNews() {
  const articles = await apiGetList<NewsArticle>("/actualites/");

  const latest = articles.slice(0, 3);

  if (latest.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucune actualité publiée pour le moment.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((article) => (
        <Link
          key={article.id}
          href={`/actualites/${article.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
        >
          {article.image ? (
            <div className="relative h-40 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-40 w-full bg-emerald-50" />
          )}

          <div className="p-4">
            <h3 className="line-clamp-2 font-bold text-gray-950">
              {article.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm text-gray-600">
              {article.excerpt ?? article.body}
            </p>

            <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
              Lire l’article →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}


async function LatestGallery() {
  const albums = await apiGetList<GalleryAlbum>("/albums/");

  const latest = albums.slice(0, 3);

  if (latest.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucun album photo disponible.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((album) => {
        const cover = album.images?.[0]?.image;

        return (
          <Link
            key={album.id}
            href={`/galerie/${album.slug}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
          >
            {cover ? (
              <div className="relative h-40 w-full">
                <Image
                  src={cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-40 w-full bg-emerald-50" />
            )}

            <div className="p-4">
              <h3 className="font-bold text-gray-950">
                {album.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {album.images?.length ?? 0} photo
                {(album.images?.length ?? 0) > 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


export default function HomePage() {
  return (
    <div className="space-y-12 pb-10 sm:space-y-16">
      <HomeHero />

      {/* Mosquées */}
      <section aria-labelledby="mosques-title">
        <SectionHeading
          title="Nos mosquées"
          description="Découvrez les mosquées de la communauté et accédez à leurs informations, horaires et activités."
          href="/mosquees"
          linkLabel="Toutes les mosquées"
        />

        <Suspense fallback={<LoadingCard lines={4} />}>
          <FeaturedMosques />
        </Suspense>
      </section>

      {/* Horaires */}
      <section aria-labelledby="prayer-title">
        <SectionHeading
          title="Horaires de prière"
          description="Consultez les heures des cinq prières quotidiennes."
          href="/horaires"
          linkLabel="Tous les horaires"
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <Suspense fallback={<LoadingCard lines={5} />}>
            <PrayerTimesToday />
          </Suspense>
        </div>
      </section>

      {/* Annonces et événements */}
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="announcements-title">
          <SectionHeading
            title="Dernières annonces"
            description="Les informations importantes de la communauté."
            href="/annonces"
            linkLabel="Toutes les annonces"
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <Suspense fallback={<LoadingCard lines={4} />}>
              <AnnouncementsList />
            </Suspense>
          </div>
        </section>

        <section aria-labelledby="events-title">
          <SectionHeading
            title="Prochains événements"
            description="Les rendez-vous et activités à venir."
            href="/evenements"
            linkLabel="Tous les événements"
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <Suspense fallback={<EventsSkeleton />}>
              <UpcomingEvents />
            </Suspense>
          </div>
        </section>
      </div>

      {/* Actualités */}
      <section aria-labelledby="news-title">
        <SectionHeading
          title="Actualités"
          description="Suivez la vie et les activités des mosquées."
          href="/actualites"
          linkLabel="Toutes les actualités"
        />

        <Suspense fallback={<LoadingCard lines={4} />}>
          <LatestNews />
        </Suspense>
      </section>

      {/* Galerie */}
      <section aria-labelledby="gallery-title">
        <SectionHeading
          title="Galerie"
          description="Revivez les moments forts de la communauté."
          href="/galerie"
          linkLabel="Voir la galerie"
        />

        <Suspense fallback={<LoadingCard lines={3} />}>
          <LatestGallery />
        </Suspense>
      </section>

      {/* Contact */}
      <section
        aria-labelledby="contact-title"
        className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8"
      >
        <div>
          <h2
            id="contact-title"
            className="text-xl font-bold text-emerald-950"
          >
            Besoin d’informations ?
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-900/80">
            Choisissez une mosquée pour consulter ses coordonnées ou lui
            envoyer un message.
          </p>
        </div>

        <Link
          href="/mosquees"
          className="mt-5 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 sm:mt-0"
        >
          Choisir une mosquée
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}