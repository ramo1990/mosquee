import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Newspaper } from "lucide-react";

import { apiGet } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await apiGet<NewsArticle>(
    `/actualites/${slug}/`
  ).catch(() => null);

  if (!article) {
    notFound();
  }

  const publicationDate = article.published_at
    ? new Date(article.published_at)
    : null;

  const formattedDate =
    publicationDate && !Number.isNaN(publicationDate.getTime())
      ? publicationDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <main className="min-h-dvh bg-gray-50">

      {/* EN-TÊTE */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Retour aux actualités
          </Link>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Newspaper size={18} />
            Actualités de Mosquée CI
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {formattedDate && (
            <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
              <CalendarDays size={17} />
              Publié le {formattedDate}
            </div>
          )}
        </div>
      </section>

      {/* ARTICLE */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">

        <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* IMAGE */}
          {article.image ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-50">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-emerald-50 text-emerald-800">
              <Newspaper size={64} />
            </div>
          )}

          {/* CONTENU */}
          <div className="p-6 sm:p-10 lg:p-12">

            {formattedDate && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
                <CalendarDays size={15} />
                {formattedDate}
              </div>
            )}

            {article.excerpt && (
              <p className="mb-8 border-l-4 border-emerald-700 pl-5 text-lg font-semibold leading-relaxed text-gray-700">
                {article.excerpt}
              </p>
            )}

            <div className="whitespace-pre-line break-words text-base leading-8 text-gray-700 sm:text-lg">
              {article.body}
            </div>

            {/* RETOUR */}
            <div className="mt-12 border-t border-gray-100 pt-8">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
              >
                <ArrowLeft size={17} />
                Toutes les actualités
              </Link>
            </div>
          </div>
        </article>

        {/* AUTRES LIENS */}
        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Restez informés
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Retrouvez les dernières informations et les activités
            organisées par votre mosquée.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/annonces"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
            >
              Nos annonces
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              Nos événements
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}