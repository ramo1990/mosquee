
"use client";

import { useClassrooms } from "./useClassrooms";

import ClassroomStats from "./ClassroomStats";
import ClassroomSearch from "./ClassroomSearch";
import ClassroomTable from "./ClassroomTable";
import ClassroomModal from "./ClassroomModal";

export default function ClassesManagement() {
  const classrooms = useClassrooms();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {classrooms.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {classrooms.error}
        </div>
      )}

      {classrooms.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {classrooms.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des classes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et gérez les classes, niveaux et groupes d’élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={classrooms.loadClassrooms}
            disabled={classrooms.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={classrooms.openCreateModal}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Créer une classe
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <ClassroomStats
        total={classrooms.classrooms.length}
        active={classrooms.activeCount}
        inactive={classrooms.inactiveCount}
        students={classrooms.totalStudents}
      />

      {/* Recherche et filtres */}
      <ClassroomSearch
        search={classrooms.search}
        statusFilter={classrooms.statusFilter}
        loading={classrooms.loading}
        onSearchChange={classrooms.setSearch}
        onStatusChange={classrooms.setStatusFilter}
        onRefresh={classrooms.loadClassrooms}
      />

      {/* Tableau */}
      <ClassroomTable
        classrooms={classrooms.filteredClassrooms}
        loading={classrooms.loading}
        updatingId={classrooms.updatingId}
        onEdit={classrooms.openEditModal}
        onToggleStatus={classrooms.toggleStatus}
      />

      {/* Modale création / modification */}
      <ClassroomModal
        open={classrooms.modalOpen}
        editing={classrooms.editingId !== null}
        form={classrooms.form}
        saving={classrooms.saving}
        onChange={classrooms.updateForm}
        onSubmit={classrooms.submitForm}
        onClose={classrooms.closeModal}
      />

    </div>
  );
}
