"use client";

import { useLearningPrograms } from "./useLearningPrograms";

import LearningProgramsStats from "./LearningProgramsStats";
import LearningProgramsFilters from "./LearningProgramsFilters";
import LearningProgramsTable from "./LearningProgramsTable";
import LearningProgramModal from "./LearningProgramModal";

export default function LearningProgramsManagement() {
  const programs = useLearningPrograms();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {programs.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {programs.error}
        </div>
      )}

      {programs.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {programs.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Programmes d’apprentissage
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Définissez les programmes, objectifs et contenus pédagogiques.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={programs.loadPrograms}
            disabled={programs.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={programs.openCreateModal}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Créer un programme
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <LearningProgramsStats
        total={programs.programs.length}
        active={programs.activeCount}
        inactive={programs.inactiveCount}
        levels={programs.availableLevels.length}
      />

      {/* Recherche et filtres */}
      <LearningProgramsFilters
        search={programs.search}
        levelFilter={programs.levelFilter}
        statusFilter={programs.statusFilter}
        availableLevels={programs.availableLevels}
        onSearchChange={programs.setSearch}
        onLevelChange={programs.setLevelFilter}
        onStatusChange={programs.setStatusFilter}
      />

      {/* Tableau */}
      <LearningProgramsTable
        programs={programs.filteredPrograms}
        loading={programs.loading}
        updatingId={programs.updatingId}
        onEdit={programs.openEditModal}
        onToggleStatus={programs.toggleStatus}
      />

      {/* Modale création / modification */}
      <LearningProgramModal
        open={programs.showModal}
        form={programs.form}
        saving={programs.saving}
        editing={programs.editingId !== null}
        updateForm={programs.updateForm}
        onSubmit={programs.submitForm}
        onClose={programs.closeModal}
      />

    </div>
  );
}