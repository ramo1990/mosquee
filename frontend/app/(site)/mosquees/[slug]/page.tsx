import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { apiGet, apiGetList } from "@/lib/api";
import type {
  GalleryAlbum,
  MosqueProfile,
  NewsArticle,
  Event,
  DonationCampaign,
} from "@/lib/types";

import MosqueContactForm from "@/components/MosqueContactForm";
import MosquePrayerTimesToday from "@/components/MosquePrayerTimesToday";
import MosqueAnnouncements from "@/components/MosqueAnnouncements";
import MosqueDonationForm from "@/components/MosqueDonationForm";
import MosqueRamadanSchedule from "@/components/MosqueRamadanSchedule";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <div
      aria-label="Chargement du contenu"
      className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 h-5 w-2/5 rounded-lg bg-gray-200" />
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className="h-3 rounded-full bg-gray-100"
            style={{ width: `${100 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
      <p className="text-sm text-gray-500">{children}</p>
    </div>
  );
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date à confirmer";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Abidjan",
  }).format(parsed);
}

async function MosqueHero({ slug }: { slug: string }) {
  const mosque = await apiGet<MosqueProfile>(
    `/mosquees/${slug}/`
  ).catch(() => null);

  if (!mosque) notFound();

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-700 shadow-xl">
      {mosque.cover_image && (
        <Image
          src={mosque.cover_image}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="-z-20 object-cover opacity-25"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-linear-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-900/40" />

      <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="max-w-3xl">
          {mosque.logo && (
            <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24">
              <Image
                src={mosque.logo}
                alt={`Logo de ${mosque.name}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          )}

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Notre communauté
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {mosque.name}
          </h1>

          {mosque.slogan && (
            <p className="mt-4 text-lg font-semibold text-amber-300 sm:text-xl">
              {mosque.slogan}
            </p>
          )}

          {mosque.description && (
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg">
              {mosque.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {mosque.address && (
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                <span aria-hidden="true">📍</span>
                <span>
                  {mosque.address}
                  {mosque.city ? `, ${mosque.city}` : ""}
                </span>
              </div>
            )}

            {mosque.phone && (
              <a
                href={`tel:${mosque.phone}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/20"
              >
                <span aria-hidden="true">☎</span>
                {mosque.phone}
              </a>
            )}

            {mosque.whatsapp && (
              <a
                href={`https://wa.me/${mosque.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/20"
              >
                <span aria-hidden="true">↗</span>
                Contacter sur WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getCurrentTimestamp(): number {
  return Date.now();
}

async function MosqueEvents({ slug }: { slug: string }) {
  const events = await apiGetList<Event>(
    `/evenements/mosquee/${slug}/`
  );

  const now = getCurrentTimestamp();

  const latest = events
    .filter((event) => {
      const date = new Date(event.starts_at).getTime();

      return Number.isFinite(date) && date >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.starts_at).getTime() -
        new Date(b.starts_at).getTime()
    )
    .slice(0, 3);

  if (latest.length === 0) {
    return (
      <EmptyState>
        Aucun événement à venir pour le moment.
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((event) => (
        <article
          key={event.id}
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-800">
            <span aria-hidden="true">📅</span>
          </div>

          <h3 className="text-lg font-bold text-gray-950">
            {event.title}
          </h3>

          <p className="mt-3 text-sm font-semibold text-emerald-700">
            {formatDate(event.starts_at)}
          </p>

          {event.location && (
            <p className="mt-2 text-sm text-gray-600">
              {event.location}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

async function MosqueNews({ slug }: { slug: string }) {
  const articles = await apiGetList<NewsArticle>(
    `/mosquees/${slug}/actualites/`
  );

  const latest = articles.slice(0, 3);

  if (!latest.length) {
    return <EmptyState>Aucune actualité publiée pour le moment.</EmptyState>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((article) => (
        <Link
          key={article.id}
          href={`/actualites/${article.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
        >
          <div className="relative h-48 overflow-hidden bg-emerald-50">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-emerald-800">
                <span aria-hidden="true">📰</span>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-950 transition group-hover:text-emerald-800">
              {article.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
              {article.excerpt || article.body}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              Lire l’article
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function MosqueGallery({ slug }: { slug: string }) {
  const albums = await apiGetList<GalleryAlbum>(
    `/mosquees/${slug}/albums/`
  );

  const latest = albums.slice(0, 3);

  if (!latest.length) {
    return <EmptyState>Aucun album photo disponible pour le moment.</EmptyState>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((album) => {
        const cover = album.images?.[0]?.image;
        const photoCount = album.images?.length ?? 0;

        return (
          <Link
            key={album.id}
            href={`/galerie/${album.slug}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden bg-emerald-50">
              {cover ? (
                <Image
                  src={cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl text-emerald-800">
                  <span aria-hidden="true">🖼</span>
                </div>
              )}

              <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {photoCount} photo{photoCount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-950 transition group-hover:text-emerald-800">
                {album.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-emerald-700">
                Découvrir l’album →
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function MosqueDonations({ slug }: { slug: string }) {
  const campaigns = await apiGetList<DonationCampaign>(
    `/campagnes-dons/mosquee/${slug}/`
  );

  return (
    <MosqueDonationForm
      mosqueSlug={slug}
      campaigns={campaigns.map((campaign) => ({
        slug: campaign.slug,
        title: campaign.title,
      }))}
    />
  );
}

export default function MosquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<MosquePageSkeleton />}>
      <MosquePageContent params={params} />
    </Suspense>
  );
}

async function MosquePageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-12 pb-12 sm:space-y-16">
      <Suspense fallback={<MosquePageSkeleton />}>
        <MosqueHero slug={slug} />
      </Suspense>

      <section
        aria-labelledby="screens-heading"
        className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-amber-50 p-6 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
              Affichage en direct
            </p>
            <h2
              id="screens-heading"
              className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl"
            >
              Les écrans de la mosquée
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Consultez les écrans d’affichage, les horaires de prière et les informations diffusées dans les salles.
            </p>
          </div>

          <Link
            href={`/mosquees/${slug}/ecrans`}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Voir les écrans
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          title="Horaires de prière"
          description="Retrouvez les horaires quotidiens propres à cette mosquée."
        />
        <Suspense fallback={<LoadingCard lines={5} />}>
          <MosquePrayerTimesToday mosqueSlug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Programme Ramadan"
          description="Les horaires du Suhoor, de l’Iftar et de la Tarawih."
        />
        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueRamadanSchedule mosqueSlug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Annonces"
          description="Les informations importantes communiquées par cette mosquée."
        />
        <Suspense fallback={<LoadingCard lines={4} />}>
          <MosqueAnnouncements mosqueSlug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Prochains événements"
          description="Les activités et rendez-vous à venir de la communauté."
        />
        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueEvents slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Actualités"
          description="Suivez les nouvelles et les informations de la mosquée."
        />
        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueNews slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Galerie photo"
          description="Revivez les moments forts de la vie de la communauté."
        />
        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueGallery slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Soutenir la mosquée"
          description="Contribuez aux projets et aux activités de votre communauté."
        />
        <Suspense fallback={<LoadingCard lines={5} />}>
          <MosqueDonations slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Contacter la mosquée"
          description="Envoyez directement un message à l’équipe de la mosquée."
        />
        <MosqueContactForm mosqueSlug={slug} />
      </section>
    </div>
  );
}

function MosquePageSkeleton() {
  return (
    <div className="space-y-10 pb-12">
      <div className="h-80 animate-pulse rounded-3xl bg-emerald-100" />
      <LoadingCard lines={3} />
      <LoadingCard lines={5} />
      <LoadingCard lines={3} />
    </div>
  );
}
