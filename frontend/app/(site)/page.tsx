
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  HandHeart,
  MapPin,
  Moon,
  Images,
  Newspaper,
  Sparkles,
} from "lucide-react";

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
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-600"
        >
          {linkLabel}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >
          <div className="h-44 bg-gray-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-6 py-14 text-white shadow-xl sm:px-10 sm:py-20 lg:px-16">

      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-35 border-white/5" />
      <div className="pointer-events-none absolute -right-5 -top-5 h-64 w-64 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur">
          <Sparkles size={16} />
          Bienvenue dans notre communauté
        </div>

        <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Ensemble dans la foi,
          <span className="mt-2 block text-emerald-200">
            unis dans la fraternité.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-emerald-50/90 sm:text-lg">
          Retrouvez les mosquées de notre communauté, les horaires
          de prière, les annonces, les événements et toutes les
          informations importantes de la vie musulmane.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mosquees"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-emerald-950 transition hover:bg-emerald-50"
          >
            Découvrir les mosquées
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/horaires"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
          >
            <Clock size={18} />
            Horaires de prière
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 border-t border-white/15 pt-7 text-sm font-medium text-emerald-100">
          <span className="flex items-center gap-2">
            <Moon size={17} />
            Spiritualité
          </span>
          <span className="flex items-center gap-2">
            <Heart size={17} />
            Solidarité
          </span>
          <span className="flex items-center gap-2">
            <HandHeart size={17} />
            Fraternité
          </span>
        </div>
      </div>
    </section>
  );
}

async function FeaturedMosques() {
  const mosques = await apiGetList<MosqueProfile>("/mosquees/")
    .catch(() => []);

  const featured = mosques.slice(0, 3);

  if (!featured.length) {
    return (
      <p className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500">
        Aucune mosquée disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((mosque) => (
        <Link
          key={mosque.id}
          href={`/mosquees/${mosque.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
        >
          <div className="relative h-48 overflow-hidden bg-emerald-50">
            {mosque.cover_image ? (
              <Image
                src={mosque.cover_image}
                alt={mosque.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Moon size={48} className="text-emerald-300" />
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg font-extrabold text-gray-950">
              {mosque.name}
            </h3>

            {mosque.slogan && (
              <p className="mt-1 text-sm font-medium text-emerald-700">
                {mosque.slogan}
              </p>
            )}

            <p className="mt-3 flex items-start gap-2 text-sm text-gray-500">
              <MapPin size={17} className="mt-0.5 shrink-0 text-emerald-700" />
              {mosque.address}, {mosque.city}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-bold text-emerald-800">
              Découvrir
              <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function LatestNews() {
  const articles = await apiGetList<NewsArticle>("/actualites/")
    .catch(() => []);

  const latest = articles.slice(0, 3);

  if (!latest.length) {
    return <p className="text-sm text-gray-500">Aucune actualité publiée.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((article) => (
        <Link
          key={article.id}
          href={`/actualites/${article.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative h-44 overflow-hidden bg-emerald-50">
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <Newspaper size={15} />
              Actualité
            </div>

            <h3 className="mt-3 line-clamp-2 font-extrabold text-gray-950">
              {article.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
              {article.excerpt ?? article.body}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">
              Lire l&apos;article
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function LatestGallery() {
  const albums = await apiGetList<GalleryAlbum>("/albums/")
    .catch(() => []);

  const latest = albums.slice(0, 3);

  if (!latest.length) {
    return <p className="text-sm text-gray-500">Aucun album disponible.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((album) => {
        const cover = album.images?.[0]?.image;

        return (
          <Link
            key={album.id}
            href={`/galerie/${album.slug}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-44 overflow-hidden bg-emerald-50">
              {cover && (
                <Image
                  src={cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Images size={17} />
                Galerie photo
              </div>

              <h3 className="mt-3 font-extrabold text-gray-950">
                {album.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {album.images?.length ?? 0} photo(s)
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function DonationsBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-rose-950 via-rose-800 to-rose-700 p-7 text-white sm:p-10">
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border-30 border-white/5" />

      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-rose-200">
            <Heart size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">
              Solidarité et générosité
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black sm:text-3xl">
            Soutenons ensemble notre mosquée.
          </h2>

          <p className="mt-3 text-sm leading-7 text-rose-100">
            Chaque contribution aide à financer l&apos;entretien,
            les activités et les projets de notre communauté.
            Votre générosité fait la différence.
          </p>
        </div>

        <Link
          href="/dons"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-rose-900 transition hover:bg-rose-50"
        >
          Faire un don
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="space-y-14 pb-14 sm:space-y-20">

      <HomeHero />

      {/* MOSQUÉES */}
      <section>
        <SectionHeading
          title="Nos mosquées"
          description="Découvrez les lieux de prière et les communautés qui nous rassemblent."
          href="/mosquees"
          linkLabel="Toutes les mosquées"
        />

        <Suspense fallback={<LoadingCard />}>
          <FeaturedMosques />
        </Suspense>
      </section>

      {/* HORAIRES */}
      <section>
        <SectionHeading
          title="Horaires de prière"
          description="Organisez votre journée autour des cinq prières quotidiennes."
          href="/horaires"
          linkLabel="Tous les horaires"
        />

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-gray-100" />}>
            <PrayerTimesToday />
          </Suspense>
        </div>
      </section>

      {/* ANNONCES ET ÉVÉNEMENTS */}
      <section className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8">
        <div>
          <SectionHeading
            title="Annonces"
            description="Les informations importantes de notre communauté."
            href="/annonces"
            linkLabel="Tout consulter"
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <Suspense fallback={<LoadingCard />}>
              <AnnouncementsList />
            </Suspense>
          </div>
        </div>

        <div>
          <SectionHeading
            title="Événements"
            description="Découvrez les prochains rendez-vous."
            href="/evenements"
            linkLabel="Tous les événements"
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <Suspense fallback={<EventsSkeleton />}>
              <UpcomingEvents />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section>
        <SectionHeading
          title="Actualités"
          description="Suivez les nouvelles et les activités de nos mosquées."
          href="/actualites"
          linkLabel="Toutes les actualités"
        />

        <Suspense fallback={<LoadingCard />}>
          <LatestNews />
        </Suspense>
      </section>

      {/* DONS */}
      <DonationsBanner />

      {/* GALERIE */}
      <section>
        <SectionHeading
          title="Galerie photo"
          description="Revivez les moments forts de notre communauté."
          href="/galerie"
          linkLabel="Voir la galerie"
        />

        <Suspense fallback={<LoadingCard />}>
          <LatestGallery />
        </Suspense>
      </section>

      {/* CONTACT */}
      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
        <div>
          <div className="flex items-center gap-2 text-emerald-800">
            <BookOpen size={21} />
            <span className="text-sm font-bold uppercase tracking-wide">
              Restons en contact
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold text-emerald-950">
            Une question ? Nous sommes à votre écoute.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-emerald-900/80">
            Retrouvez les coordonnées des mosquées et les informations
            nécessaires pour prendre contact avec votre communauté.
          </p>
        </div>

        <Link
          href="/contact"
          className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-bold text-white transition hover:bg-emerald-900 sm:mt-0"
        >
          Nous contacter
          <ArrowRight size={18} />
        </Link>
      </section>

    </main>
  );
}