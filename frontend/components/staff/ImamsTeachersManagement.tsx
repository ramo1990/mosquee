
"use client";

import { useStaff } from "./useStaff";

import StaffStats from "./StaffStats";
import StaffSearch from "./StaffSearch";
import StaffTable from "./StaffTable";
import StaffCreateModal from "./StaffCreateModal";

export default function ImamsTeachersManagement() {
  const staff = useStaff();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {staff.error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          {staff.error}
        </div>
      )}

      {staff.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {staff.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des imams et enseignants
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les responsables religieux et pédagogiques.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={staff.openCreateModal}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Ajouter un membre
          </button>

          <button
            type="button"
            onClick={staff.loadMembers}
            disabled={staff.loading}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <StaffStats
        total={staff.members.length}
        imams={staff.imamCount}
        teachers={staff.teacherCount}
        active={staff.activeCount}
      />

      {/* Recherche et filtre */}
      <StaffSearch
        search={staff.search}
        roleFilter={staff.roleFilter}
        onSearchChange={staff.setSearch}
        onRoleChange={staff.setRoleFilter}
      />

      {/* Tableau */}
      <StaffTable
        members={staff.filteredMembers}
        loading={staff.loading}
        updatingId={staff.updatingId}
        onToggleStatus={staff.toggleStatus}
      />

      {/* Modale de création */}
      <StaffCreateModal
        open={staff.modalOpen}
        form={staff.form}
        saving={staff.saving}
        updateForm={staff.updateForm}
        onSubmit={staff.createStaffMember}
        onClose={staff.closeModal}
      />

    </div>
  );
}
