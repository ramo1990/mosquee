
"use client";

import ScreensModal from "./ScreensModal";
import ScreensFilters from "./ScreensFilters";
import ScreensTable from "./ScreensTable";
import StatCard from "./StatCard";

import { useScreens } from "./useScreens";

export default function ScreensManagement() {
  const management = useScreens();

  return (
    <div className="space-y-6">

      <ScreensModal
        open={management.showForm}
        form={management.form}
        editingId={management.editingId}
        saving={management.saving}
        updateForm={management.updateForm}
        onSubmit={management.submitForm}
        onClose={management.closeForm}
      />

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
            Écrans d'affichage
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les écrans, leurs statuts, leurs groupes et les contenus diffusés.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={management.loadScreens}
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
            Ajouter un écran
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total écrans" value={management.screens.length} />
        <StatCard title="En ligne" value={management.onlineCount} />
        <StatCard title="Hors ligne" value={management.offlineCount} />
        <StatCard title="En maintenance" value={management.maintenanceCount} />
      </div>

      <ScreensFilters
        search={management.search}
        setSearch={management.setSearch}
        statusFilter={management.statusFilter}
        setStatusFilter={management.setStatusFilter}
        groupFilter={management.groupFilter}
        setGroupFilter={management.setGroupFilter}
        availableGroups={management.availableGroups}
      />

      <ScreensTable
        screens={management.filteredScreens}
        loading={management.loading}
        updatingId={management.updatingId}
        onEdit={management.openEditForm}
        onChangeStatus={management.changeStatus}
      />

    </div>
  );
}