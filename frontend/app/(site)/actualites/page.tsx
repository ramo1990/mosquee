
import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight, CalendarDays, BookOpen } from "lucide-react";

import { apiGetList } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";

export default async function NewsPage() {
  let articles: NewsArticle[] = [];

  try {
    articles = await apiGetList<NewsArticle>("/actualites/");
  } catch (error) {
    console.error("Erreur de chargement des actualités :", error);
  }

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <main className="min-h-dvh bg-gray-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-20 text-white sm:py-24">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex items-center gap-3 text-emerald-300">
            <Newspaper size={22} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              Mosquée CI
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Actualités de notre communauté
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-100 sm:text-lg">
            Retrouvez les dernières nouvelles, les informations
            importantes et les moments forts de la vie de votre mosquée.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-48 right-1/3 h-96 w-96 rounded-full border-[35px] border-white/5" />
      </section>

      {/* CONTENU */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            Restez informés
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Toutes nos actualités
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Découvrez les informations publiées par votre mosquée.
          </p>
        </div>

        {!featuredArticle ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <BookOpen size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Aucune actualité disponible
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Les prochaines actualités de votre mosquée apparaîtront ici.
              Revenez bientôt !
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
            >
              Retour à l&apos;accueil
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            {/* ACTUALITÉ PRINCIPALE */}
            <Link
              href={`/actualites/${featuredArticle.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-emerald-100 lg:aspect-auto lg:min-h-[350px]">
                {featuredArticle.image ? (
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-64 items-center justify-center text-emerald-800">
                    <Newspaper size={64} />
                  </div>
                )}

                <span className="absolute left-5 top-5 rounded-full bg-amber-400 px-4 py-2 text-xs font-extrabold uppercase text-emerald-950">
                  À la une
                </span>
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-9">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Actualité principale
                </span>

                <h3 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 transition group-hover:text-emerald-800 sm:text-3xl">
                  {featuredArticle.title}
                </h3>

                <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {featuredArticle.excerpt ?? featuredArticle.body}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">
                  Lire l&apos;article
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>

            {/* AUTRES ACTUALITÉS */}
            {otherArticles.length > 0 && (
              <div className="mt-14">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      Dernières publications
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Les autres nouvelles de votre mosquée.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                    {otherArticles.length} article(s)
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/actualites/${article.slug}`}
                      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-50">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-emerald-700">
                            <Newspaper size={45} />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                          <CalendarDays size={14} />
                          <span>Actualité de la mosquée</span>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-gray-900 transition group-hover:text-emerald-800">
                          {article.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                          {article.excerpt ?? article.body}
                        </p>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-bold text-emerald-800">
                          Lire l&apos;article
                          <ArrowRight
                            size={17}
                            className="transition group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* APPEL À LA COMMUNAUTÉ */}
      <section className="border-t border-gray-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Restons connectés à notre communauté
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
            Suivez les activités, les annonces et les événements
            organisés par votre mosquée.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/annonces"
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
            >
              Voir les annonces
            </Link>

            <Link
              href="/evenements"
              className="rounded-xl border border-emerald-800 px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              Nos événements
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}