
"use client";

import { useAssignments } from "./useAssignments";

import AssignmentsStats from "./AssignmentsStats";
import AssignmentsFilters from "./AssignmentsFilters";
import AssignmentsTable from "./AssignmentsTable";
import AssignmentModal from "./AssignmentModal";

export default function AssignmentsManagement() {
  const {
    assignments,
    teachers,
    classrooms,
    filteredAssignments,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    classroomFilter,
    setClassroomFilter,
    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    publishedCount,
    draftCount,

    loadAssignments,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    togglePublication,
  } = useAssignments();

  return (
    <div className="space-y-6">

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Devoirs et évaluations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez les devoirs, contrôles et évaluations destinés aux élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadAssignments}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Créer un devoir
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <AssignmentsStats
        total={assignments.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
        classroomsCount={classrooms.length}
      />

      {/* Modal création / modification */}
      <AssignmentModal
        open={showForm}
        form={form}
        teachers={teachers}
        classrooms={classrooms}
        editingId={editingId}
        saving={saving}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      {/* Filtres */}
      <AssignmentsFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        classroomFilter={classroomFilter}
        setClassroomFilter={setClassroomFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        classrooms={classrooms}
      />

      {/* Tableau */}
      <AssignmentsTable
        records={filteredAssignments}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditForm}
        onTogglePublication={togglePublication}
      />

    </div>
  );
}