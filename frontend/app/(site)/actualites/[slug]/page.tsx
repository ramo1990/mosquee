import { notFound } from "next/navigation";
import Image from "next/image";

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

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-12 text-white">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold leading-tight">
          {article.title}
        </h1>

        {article.published_at && (
          <p className="mt-3 text-sm text-gray-400">
            {new Date(article.published_at).toLocaleDateString("fr-FR")}
          </p>
        )}

        {article.image && (
          <div className="relative mt-8 h-80 w-full overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-gray-200">
          {article.body}
        </p>
      </article>
    </main>
  );
}