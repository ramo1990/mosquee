"use client";

import { useMembers } from "./useMembers";

import MembersStats from "./MembersStats";
import MembersFilters from "./MembersFilters";
import MembersTable from "./MembersTable";
import MemberModal from "./MemberModal";

export default function MembersManagement() {
  const members = useMembers();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {members.error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <p className="font-semibold">Information</p>

          <p className="mt-1">{members.error}</p>
        </div>
      )}

      {members.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {members.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Répertoire des fidèles
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les membres de votre mosquée.
          </p>
        </div>

        <button
          type="button"
          onClick={members.openCreateModal}
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
        >
          + Ajouter un fidèle
        </button>
      </div>

      {/* Statistiques */}
      <MembersStats
        total={members.members.length}
        active={members.activeCount}
        inactive={members.inactiveCount}
        pending={members.pendingCount}
      />

      {/* Recherche et filtres */}
      <MembersFilters
        search={members.search}
        statusFilter={members.statusFilter}
        loading={members.loading}
        onSearchChange={members.setSearch}
        onStatusChange={members.setStatusFilter}
        onRefresh={members.loadMembers}
      />

      {/* Tableau des fidèles */}
      <MembersTable
        members={members.filteredMembers}
        loading={members.loading}
        onEdit={members.openEditModal}
        onDelete={members.handleDelete}
      />

      {/* Modal d'ajout et de modification */}
      <MemberModal
        open={members.modalOpen}
        isEditing={!!members.selectedMember}
        isSuperAdmin={members.user?.role === "super_admin"}
        mosques={members.mosques}
        form={members.form}
        saving={members.saving}
        onChange={members.updateField}
        onSubmit={members.handleSubmit}
        onClose={members.closeModal}
      />

    </div>
  );
}