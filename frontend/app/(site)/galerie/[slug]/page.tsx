
import Image from "next/image";
import { notFound } from "next/navigation";

import { apiGet } from "@/lib/api";
import type { GalleryAlbum } from "@/lib/types";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const album = await apiGet<GalleryAlbum>(
    `/albums/${slug}/`
  ).catch(() => null);

  if (!album) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">{album.title}</h1>

        {album.description && (
          <p className="mt-3 max-w-3xl text-gray-300">
            {album.description}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {album.images.map((image) => (
            <figure
              key={image.id}
              className="overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={image.image}
                  alt={image.caption ?? album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {image.caption && (
                <figcaption className="p-3 text-sm text-gray-300">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
