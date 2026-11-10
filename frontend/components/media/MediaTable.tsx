
import type { MediaItem } from "./types";
import { TYPE_LABELS } from "./types";

type Props = {
  media: MediaItem[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (media: MediaItem) => void;
  onTogglePublication: (media: MediaItem) => void;
};

export default function MediaTable({
  media,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des médias
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {media.length} média(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : media.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun média trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez un nouveau média ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Média</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Fichier</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {media.map((item) => {
                const isUpdating = updatingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {item.title}
                      </div>

                      {item.description && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {TYPE_LABELS[item.media_type]}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.category || "—"}
                    </td>

                    <td className="max-w-xs truncate px-6 py-4 text-gray-600">
                      {item.file_url ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline"
                        >
                          Voir le fichier
                        </a>
                      ) : (
                        "Fichier importé"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => onTogglePublication(item)}
                          disabled={isUpdating}
                          className={`font-semibold hover:underline disabled:opacity-50 ${
                            item.is_published
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {isUpdating
                            ? "Modification..."
                            : item.is_published
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