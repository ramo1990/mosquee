
"use client";

import { useScreenPreview } from "./useScreenPreview";

import ScreenPreviewSidebar from "./ScreenPreviewSidebar";
import ScreenPreviewPlayer from "./ScreenPreviewPlayer";

import {
  ScreenClock,
  PrayerTimesWidget,
} from "./ScreenPreviewWidgets";

export default function ScreenPreviewView() {
  const management = useScreenPreview();

  return (
    <div className="space-y-6">
      {management.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {management.error}
        </div>
      )}

      {management.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {management.success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Prévisualisation des écrans
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Visualisez l&apos;affichage en temps réel de chaque écran avant diffusion.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={management.loadScreens}
            disabled={management.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser les écrans
          </button>

          <button
            type="button"
            onClick={management.loadPreview}
            disabled={
              management.selectedScreenId === null ||
              management.loadingPreview
            }
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {management.loadingPreview
              ? "Chargement..."
              : "Actualiser l'aperçu"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <ScreenPreviewSidebar
          screens={management.screens}
          selectedScreenId={management.selectedScreenId}
          loading={management.loading}
          onSelect={management.setSelectedScreenId}
        />

        <div className="space-y-6">
          <ScreenPreviewPlayer
            screen={management.selectedScreen}
            content={management.currentContent}
            loading={management.loadingPreview}
            isPlaying={management.isPlaying}
            setIsPlaying={management.setIsPlaying}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ScreenClock
              time={management.formattedTime}
              date={management.formattedDate}
            />

            <PrayerTimesWidget
              prayerTimes={management.prayerTimes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}