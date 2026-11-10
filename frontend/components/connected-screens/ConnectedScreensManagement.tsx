
"use client";

import { useConnectedScreens } from "./useConnectedScreens";

import ConnectedScreensStats from "./ConnectedScreensStats";
import ConnectedScreensView from "./ConnectedScreensView";

import type { ScreenActionType } from "./types";

export default function ConnectedScreensManagement() {
  const {
    screens,
    loading,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    groupFilter,
    setGroupFilter,

    availableGroups,
    filteredScreens,

    connectedCount,
    disconnectedCount,
    maintenanceCount,

    error,
    success,

    loadScreens,
    handleScreenAction,
  } = useConnectedScreens();

  function handleAction(
    screenId: number,
    action: ScreenActionType
  ) {
    handleScreenAction({
      screenId,
      action,
    });
  }

  return (
    <div className="space-y-6">

      {/* Messages d'erreur */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Messages de succès */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Écrans connectés
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez l’état, la connexion et les informations des écrans installés.
          </p>
        </div>

        <button
          type="button"
          onClick={loadScreens}
          disabled={loading}
          className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          {loading ? "Actualisation..." : "Actualiser"}
        </button>

      </div>

      {/* Statistiques */}
      <ConnectedScreensStats
        total={screens.length}
        connected={connectedCount}
        disconnected={disconnectedCount}
        maintenance={maintenanceCount}
      />

      {/* Vue principale */}
      <ConnectedScreensView
        screens={screens}
        filteredScreens={filteredScreens}
        loading={loading}
        updatingId={updatingId}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        availableGroups={availableGroups}
        onAction={handleAction}
      />

    </div>
  );
}