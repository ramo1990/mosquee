
"use client";

import { Slide } from "./types";

type Props = {
  slides: Slide[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (slide: Slide) => void;
  onTogglePublication: (slide: Slide) => void;
  onMove: (slide: Slide, direction: -1 | 1) => void;
};

export default function SlidesView({
  slides,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
  onMove,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      {/* En-tête */}
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des diapositives
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {slides.length} diapositive(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : slides.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune diapositive trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle diapositive ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Ordre</th>
                <th className="px-6 py-4">Diapositive</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Durée</th>
                <th className="px-6 py-4">Média</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {slides.map((slide, index) => {
                const isUpdating = updatingId === slide.id;

                return (
                  <tr
                    key={slide.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {slide.display_order}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {slide.title}
                      </div>

                      {slide.content && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {slide.content}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {slide.screen_group || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {slide.duration_seconds} s
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {slide.image_url && slide.video_url
                        ? "Image et vidéo"
                        : slide.image_url
                          ? "Image"
                          : slide.video_url
                            ? "Vidéo"
                            : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          slide.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {slide.is_published
                          ? "Publiée"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">

                        <button
                          type="button"
                          onClick={() => onMove(slide, -1)}
                          disabled={isUpdating || updatingId !== null || index === 0}
                          className="font-semibold text-gray-700 hover:underline disabled:opacity-30"
                          aria-label="Monter"
                          title="Monter"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          onClick={() => onMove(slide, 1)}
                          disabled={isUpdating || updatingId !== null || index === slides.length - 1}
                          className="font-semibold text-gray-700 hover:underline disabled:opacity-30"
                          aria-label="Descendre"
                          title="Descendre"
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(slide)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(slide)}
                          disabled={updatingId !== null}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            slide.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : slide.is_published
                              ? "Dépublier"
                              : "Publier"}
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}