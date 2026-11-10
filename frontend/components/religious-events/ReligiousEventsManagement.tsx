
"use client";

import { useReligiousEvents } from "./useReligiousEvents";

import ReligiousEventsStats from "./ReligiousEventsStats";
import ReligiousEventsView from "./ReligiousEventsView";

export default function ReligiousEventsManagement() {
  const management = useReligiousEvents();

  return (
    <div className="space-y-6">

      {/* Messages d'erreur */}
      {management.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {management.error}
        </div>
      )}

      {/* Messages de succès */}
      {management.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {management.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Événements religieux
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les événements religieux,
            célébrations et rendez-vous spirituels.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={management.loadEvents}
            disabled={management.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={management.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Nouvel événement
          </button>

        </div>
      </div>

      {/* Statistiques */}
      <ReligiousEventsStats
        planned={management.plannedCount}
        ongoing={management.ongoingCount}
        completed={management.completedCount}
        published={management.publishedCount}
      />

      {/* Vue principale */}
      <ReligiousEventsView
        management={management}
      />

    </div>
  );
}