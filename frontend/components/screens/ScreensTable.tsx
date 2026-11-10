
"use client";

import type { Screen, ScreenStatus } from "./types";

import {
  STATUS_LABELS,
  STATUS_COLORS,
} from "./types";

type Props = {
  screens: Screen[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (screen: Screen) => void;
  onChangeStatus: (screen: Screen, status: ScreenStatus) => void;
};

export default function ScreensTable({
  screens,
  loading,
  updatingId,
  onEdit,
  onChangeStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des écrans
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {screens.length} écran(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : screens.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun écran trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Ajoutez un nouvel écran ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Écran</th>
                <th className="px-6 py-4">Emplacement</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Contenu</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {screens.map((screen) => {
                const isUpdating = updatingId === screen.id;

                return (
                  <tr key={screen.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {screen.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {screen.location || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {screen.group || "—"}
                    </td>

                    <td className="max-w-md px-6 py-4 text-gray-600">
                      {screen.content || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {screen.last_seen || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[screen.status]}`}
                      >
                        {STATUS_LABELS[screen.status]}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => onEdit(screen)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        {screen.status !== "online" && (
                          <button
                            type="button"
                            onClick={() => onChangeStatus(screen, "online")}
                            disabled={isUpdating}
                            className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                          >
                            {isUpdating ? "Traitement..." : "Marquer en ligne"}
                          </button>
                        )}

                        {screen.status !== "maintenance" && (
                          <button
                            type="button"
                            onClick={() => onChangeStatus(screen, "maintenance")}
                            disabled={isUpdating}
                            className="font-semibold text-amber-700 hover:underline disabled:opacity-50"
                          >
                            Maintenance
                          </button>
                        )}
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