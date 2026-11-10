
"use client";

import { useCommittee } from "./useCommittee";

import CommitteeStats from "./CommitteeStats";
import CommitteeSearch from "./CommitteeSearch";
import CommitteeRoleEditor from "./CommitteeRoleEditor";
import CommitteeMembersTable from "./CommitteeMembersTable";
import CommitteeCreateModal from "./CommitteeCreateModal";

export default function CommitteeManagement() {
  const committee = useCommittee();

  const activeCount = committee.members.filter(
    (member) => member.is_active
  ).length;

  const inactiveCount =
    committee.members.length - activeCount;

  return (
    <div className="space-y-6">

      {/* Messages */}
      {committee.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {committee.error}
        </div>
      )}

      {committee.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {committee.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Organisation du comité
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les comptes des membres du comité.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => committee.setShowCreateForm(true)}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Ajouter un membre
          </button>

          <button
            type="button"
            onClick={committee.loadMembers}
            disabled={committee.loading}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <CommitteeStats
        membersCount={committee.members.length}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
      />

      {/* Recherche */}
      <CommitteeSearch
        search={committee.search}
        onSearchChange={committee.setSearch}
      />

      {/* Modification fonction */}
      <CommitteeRoleEditor
        selectedMember={committee.selectedMember}
        committeeRole={committee.committeeRole}
        saving={
          committee.selectedMemberId !== null &&
          committee.savingRoleId === committee.selectedMemberId
        }
        onRoleChange={committee.setCommitteeRole}
        onSave={committee.updateCommitteeRole}
      />

      {/* Liste des membres */}
      <CommitteeMembersTable
        members={committee.filteredMembers}
        loading={committee.loading}
        updatingId={committee.updatingId}
        onSelect={committee.selectMember}
        onToggleStatus={committee.toggleStatus}
      />

      {/* Modale de création */}
      <CommitteeCreateModal
        open={committee.showCreateForm}
        form={committee.form}
        saving={committee.saving}
        updateForm={committee.updateForm}
        onSubmit={committee.createCommitteeMember}
        onClose={() => committee.setShowCreateForm(false)}
      />

    </div>
  );
}
