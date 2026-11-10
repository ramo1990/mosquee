
"use client";

import type { Screen, ScreenContent } from "./types";

type Props = {
  screen: Screen | null;
  content: ScreenContent | null;
  loading: boolean;
  isPlaying: boolean;
  setIsPlaying: (value: (current: boolean) => boolean) => void;
};

export default function ScreenPreviewPlayer({
  screen,
  content,
  loading,
  isPlaying,
  setIsPlaying,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-bold text-gray-900">
            {screen?.name || "Aucun écran sélectionné"}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {screen?.location || "Sélectionnez un écran."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((current) => !current)}
          disabled={!content}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {isPlaying ? "Mettre en pause" : "Lire"}
        </button>
      </div>

      <div className="mt-5 aspect-video w-full overflow-hidden rounded-xl bg-gray-950">
        {!screen ? (
          <PreviewMessage
            title="Aucun écran sélectionné"
            description="Choisissez un écran dans la liste."
          />
        ) : loading ? (
          <PreviewMessage
            title="Chargement de l'aperçu"
            description="Récupération du contenu programmé..."
          />
        ) : !content ? (
          <PreviewMessage
            title="Aucun contenu actif"
            description="Aucun contenu n'est programmé actuellement."
          />
        ) : content.media_type === "video" && content.media_url ? (
          <video
            key={content.id}
            src={content.media_url}
            autoPlay={isPlaying}
            loop
            muted
            playsInline
            controls
            className="h-full w-full object-cover"
          />
        ) : content.media_type === "image" && content.media_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={content.id}
            src={content.media_url}
            alt={content.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <h4 className="text-3xl font-extrabold text-white">
              {content.title}
            </h4>

            {content.content && (
              <p className="mt-4 max-w-2xl text-lg text-gray-200">
                {content.content}
              </p>
            )}
          </div>
        )}
      </div>

      {content && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-bold text-gray-900">
            {content.title}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Priorité : {content.priority}
          </p>
        </div>
      )}
    </div>
  );
}

function PreviewMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <h4 className="text-2xl font-bold text-white">{title}</h4>
      <p className="mt-3 max-w-md text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
}