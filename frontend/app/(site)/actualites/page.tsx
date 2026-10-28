import Link from "next/link";
import Image from "next/image";

import { apiGetList } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";

export default async function NewsPage() {
  const articles = await apiGetList<NewsArticle>("/actualites/");

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">Actualités</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/actualites/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-emerald-400/50"
            >
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}

              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {article.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-gray-300">
                  {article.excerpt ?? article.body}
                </p>

                <p className="mt-3 text-sm text-emerald-300">
                  Lire l’article →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}