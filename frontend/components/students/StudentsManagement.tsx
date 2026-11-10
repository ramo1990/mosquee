"use client";

import { useStudents } from "./useStudents";

import StudentsStats from "./StudentsStats";
import StudentsFilters from "./StudentsFilters";
import StudentsTable from "./StudentsTable";
import StudentModal from "./StudentModal";

export default function StudentsManagement() {
  const students = useStudents();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {students.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {students.error}
        </div>
      )}

      {students.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {students.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des élèves
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Inscrivez, consultez et suivez les élèves de vos classes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={students.loadStudents}
            disabled={students.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={students.openCreateModal}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Inscrire un élève
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <StudentsStats
        total={students.students.length}
        active={students.activeCount}
        inactive={students.inactiveCount}
        classrooms={students.classrooms.length}
      />

      {/* Filtres */}
      <StudentsFilters
        search={students.search}
        statusFilter={students.statusFilter}
        classroomFilter={students.classroomFilter}
        classrooms={students.classrooms}
        onSearchChange={students.setSearch}
        onStatusChange={students.setStatusFilter}
        onClassroomChange={students.setClassroomFilter}
      />

      {/* Tableau */}
      <StudentsTable
        students={students.filteredStudents}
        loading={students.loading}
        updatingId={students.updatingId}
        onToggleStatus={students.toggleStatus}
      />

      {/* Modale d'inscription */}
      <StudentModal
        open={students.showModal}
        form={students.form}
        classrooms={students.classrooms}
        saving={students.creating}
        updateForm={students.updateForm}
        onSubmit={students.createStudent}
        onClose={students.closeModal}
      />

    </div>
  );
}