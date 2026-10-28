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
} from "@/lib/types";
import MosqueContactForm from "@/components/MosqueContactForm";
import MosquePrayerTimesToday from "@/components/MosquePrayerTimesToday";


function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1.5 text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}


function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-5">
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


async function MosqueHero({ slug }: { slug: string }) {
  const mosque = await apiGet<MosqueProfile>(
    `/mosquees/${slug}/`
  ).catch(() => null);

  if (!mosque) {
    notFound();
  }

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-6 py-12 text-white sm:px-10 sm:py-16">
      {mosque.cover_image && (
        <Image
          src={mosque.cover_image}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-20"
        />
      )}

      <div className="max-w-3xl">
        {mosque.logo && (
          <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-2xl border border-white/20">
            <Image
              src={mosque.logo}
              alt={mosque.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {mosque.name}
        </h1>

        {mosque.slogan && (
          <p className="mt-4 text-lg font-medium text-emerald-200 sm:text-xl">
            {mosque.slogan}
          </p>
        )}

        <p className="mt-5 max-w-xl text-emerald-50/90">
          {mosque.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-sm text-emerald-100/90">
          <span>
            {mosque.address}, {mosque.city}
          </span>

          {mosque.phone && <span>Tél. : {mosque.phone}</span>}

          {mosque.whatsapp && (
            <span>WhatsApp : {mosque.whatsapp}</span>
          )}
        </div>
      </div>
    </section>
  );
}


async function MosqueEvents({ slug }: { slug: string }) {
  const events = await apiGetList<Event>(
    `/evenements/mosquee/${slug}/`
  );

  const latest = events.slice(0, 3);

  if (latest.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucun événement à venir.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((event) => (
        <article
          key={event.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-bold text-gray-950">
            {event.title}
          </h3>

          <p className="mt-2 text-sm text-emerald-700">
            {new Date(event.starts_at).toLocaleString("fr-FR")}
          </p>

          {event.location && (
            <p className="mt-1 text-sm text-gray-600">
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

  if (latest.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aucune actualité publiée.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((article) => (
        <Link
          key={article.id}
          href={`/actualites/${article.slug}`}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
        >
          {article.image ? (
            <div className="relative h-40 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-40 w-full bg-emerald-50" />
          )}

          <div className="p-4">
            <h3 className="font-bold text-gray-950">
              {article.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm text-gray-600">
              {article.excerpt ?? article.body}
            </p>
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
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300"
          >
            {cover ? (
              <div className="relative h-40 w-full">
                <Image
                  src={cover}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
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
    <div className="space-y-12 pb-10 sm:space-y-16">
      <Suspense fallback={<LoadingCard lines={6} />}>
        <MosqueHero slug={slug} />
      </Suspense>

      <section>
        <SectionHeading
          title="Horaires de prière"
          description="Horaires propres à cette mosquée."
        />

        <Suspense fallback={<LoadingCard lines={5} />}>
          <MosquePrayerTimesToday mosqueSlug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Prochains événements"
          description="Les rendez-vous et activités de cette mosquée."
        />

        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueEvents slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Actualités"
          description="Les informations publiées par cette mosquée."
        />

        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueNews slug={slug} />
        </Suspense>
      </section>

      <section>
        <SectionHeading
          title="Galerie"
          description="Les moments forts de cette mosquée."
        />

        <Suspense fallback={<LoadingCard lines={3} />}>
          <MosqueGallery slug={slug} />
        </Suspense>
      </section>

        <section>
            <SectionHeading
                title="Contact"
                description="Envoyez un message directement à cette mosquée."
            />

            <MosqueContactForm mosqueSlug={slug} />
        </section>
    </div>
  );
}


function MosquePageSkeleton() {
  return (
    <div className="space-y-12 pb-10">
      <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />

      <LoadingCard lines={3} />
      <LoadingCard lines={3} />
      <LoadingCard lines={3} />
    </div>
  );
}