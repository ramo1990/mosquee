
"use client";

import type { Sermon } from "./types";

import { TYPE_LABELS } from "./types";

type Props = {
  sermons: Sermon[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (sermon: Sermon) => void;
  onTogglePublication: (sermon: Sermon) => void;
};

export default function SermonsTable({
  sermons,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des sermons
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {sermons.length} sermon(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : sermons.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun sermon trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez un nouveau sermon ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Sermon</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Imam</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Médias</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sermons.map((sermon) => {
                const isUpdating = updatingId === sermon.id;

                return (
                  <tr key={sermon.id} className="hover:bg-gray-50">

                    {/* Sermon */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {sermon.title}
                      </div>

                      {sermon.content && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {sermon.content}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {TYPE_LABELS[sermon.sermon_type]}
                      </span>
                    </td>

                    {/* Imam */}
                    <td className="px-6 py-4 text-gray-600">
                      {sermon.imam_name || "Non attribué"}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600">
                      {sermon.date || "—"}
                    </td>

                    {/* Médias */}
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {sermon.video_url && (
                          <a
                            href={sermon.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-700 hover:underline"
                          >
                            Vidéo
                          </a>
                        )}

                        {sermon.audio_url && (
                          <a
                            href={sermon.audio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Audio
                          </a>
                        )}

                        {!sermon.video_url && !sermon.audio_url && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          sermon.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sermon.is_published
                          ? "Publié"
                          : "Brouillon"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(sermon)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(sermon)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            sermon.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : sermon.is_published
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