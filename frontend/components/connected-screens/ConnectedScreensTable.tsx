
"use client";

import type {
  ConnectedScreen,
  ScreenActionType,
} from "./types";

import {
  STATUS_LABELS,
  STATUS_COLORS,
} from "./types";

type Props = {
  screens: ConnectedScreen[];
  loading: boolean;
  updatingId: number | null;

  onAction: (
    screenId: number,
    action: ScreenActionType
  ) => void;
};

export default function ConnectedScreensTable({
  screens,
  loading,
  updatingId,
  onAction,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      {/* En-tête */}
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Écrans installés
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {screens.length} écran(s)
        </p>
      </div>

      {/* Chargement */}
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
            Modifiez vos filtres ou vérifiez la connexion des écrans.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">

            {/* Colonnes */}
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Écran</th>
                <th className="px-6 py-4">Emplacement</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Adresse IP</th>
                <th className="px-6 py-4">Adresse MAC</th>
                <th className="px-6 py-4">Résolution</th>
                <th className="px-6 py-4">Dernière activité</th>
                <th className="px-6 py-4">Connexion</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Données */}
            <tbody className="divide-y divide-gray-100">
              {screens.map((screen) => {
                const isUpdating =
                  updatingId === screen.id;

                return (
                  <tr
                    key={screen.id}
                    className="hover:bg-gray-50"
                  >
                    {/* Écran */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {screen.name}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {screen.browser || "Navigateur inconnu"}
                      </div>
                    </td>

                    {/* Emplacement */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.location || "—"}
                    </td>

                    {/* Groupe */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.group || "—"}
                    </td>

                    {/* IP */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.ip_address || "—"}
                    </td>

                    {/* MAC */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.mac_address || "—"}
                    </td>

                    {/* Résolution */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.resolution || "—"}
                    </td>

                    {/* Dernière activité */}
                    <td className="px-6 py-4 text-gray-600">
                      {screen.last_seen || "—"}
                    </td>

                    {/* Connexion */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          STATUS_COLORS[screen.connection_status]
                        }`}
                      >
                        {STATUS_LABELS[screen.connection_status]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">

                        <button
                          type="button"
                          onClick={() =>
                            onAction(screen.id, "restart")
                          }
                          disabled={isUpdating}
                          className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Traitement..."
                            : "Redémarrer"}
                        </button>

                        {screen.connection_status !==
                          "maintenance" && (
                          <button
                            type="button"
                            onClick={() =>
                              onAction(screen.id, "maintenance")
                            }
                            disabled={isUpdating}
                            className="font-semibold text-amber-700 hover:underline disabled:opacity-50"
                          >
                            Maintenance
                          </button>
                        )}

                        {screen.connection_status ===
                          "disconnected" && (
                          <button
                            type="button"
                            onClick={() =>
                              onAction(screen.id, "activate")
                            }
                            disabled={isUpdating}
                            className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                          >
                            Activer
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