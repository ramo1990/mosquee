
import Image from "next/image";
import Link from "next/link";

import { apiGetList } from "@/lib/api";
import type { GalleryAlbum } from "@/lib/types";

export default async function GalleryPage() {
  const albums = await apiGetList<GalleryAlbum>("/albums/");

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">Galerie</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => {
            const cover = album.images[0]?.image;

            return (
              <Link
                key={album.id}
                href={`/galerie/${album.slug}`}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-emerald-400/50"
              >
                {cover ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={cover}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-emerald-950 text-gray-400">
                    Aucune image
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-bold">
                    {album.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {album.images.length} photo
                    {album.images.length > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
