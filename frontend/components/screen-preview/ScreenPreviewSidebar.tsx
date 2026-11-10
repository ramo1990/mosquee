
"use client";

import type { Screen } from "./types";

type Props = {
  screens: Screen[];
  selectedScreenId: number | null;
  loading: boolean;
  onSelect: (id: number) => void;
};

export default function ScreenPreviewSidebar({
  screens,
  selectedScreenId,
  loading,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-bold text-gray-900">Écrans disponibles</h3>

      <p className="mt-1 text-xs text-gray-500">
        {screens.length} écran(s)
      </p>

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Chargement...
          </p>
        ) : screens.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Aucun écran disponible.
          </p>
        ) : (
          screens.map((screen) => {
            const selected = screen.id === selectedScreenId;

            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => onSelect(screen.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">
                      {screen.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {screen.location || "Emplacement non défini"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      screen.is_online
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {screen.is_online ? "En ligne" : "Hors ligne"}
                  </span>
                </div>

                {screen.screen_group && (
                  <p className="mt-2 text-xs text-gray-500">
                    Groupe : {screen.screen_group}
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}