"use client";

import { useCourses } from "./useCourses";

import CoursesStats from "./CoursesStats";
import CoursesFilters from "./CoursesFilters";
import CoursesTable from "./CoursesTable";
import CourseModal from "./CourseModal";

export default function CoursesManagement() {
  const courses = useCourses();

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {courses.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {courses.error}
        </div>
      )}

      {courses.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {courses.success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des cours
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et organisez les cours, matières et séances d’enseignement.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={courses.loadCourses}
            disabled={courses.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={courses.openCreateModal}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            + Créer un cours
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <CoursesStats
        total={courses.courses.length}
        active={courses.activeCount}
        inactive={courses.inactiveCount}
        teachers={courses.teachers.length}
      />

      {/* Recherche et filtres */}
      <CoursesFilters
        search={courses.search}
        subjectFilter={courses.subjectFilter}
        teacherFilter={courses.teacherFilter}
        statusFilter={courses.statusFilter}
        availableSubjects={courses.availableSubjects}
        teachers={courses.teachers}
        onSearchChange={courses.setSearch}
        onSubjectChange={courses.setSubjectFilter}
        onTeacherChange={courses.setTeacherFilter}
        onStatusChange={courses.setStatusFilter}
      />

      {/* Tableau des cours */}
      <CoursesTable
        courses={courses.filteredCourses}
        loading={courses.loading}
        updatingId={courses.updatingId}
        onEdit={courses.openEditModal}
        onToggleStatus={courses.toggleStatus}
      />

      {/* Modale création / modification */}
      <CourseModal
        open={courses.showModal}
        form={courses.form}
        teachers={courses.teachers}
        classrooms={courses.classrooms}
        saving={courses.saving}
        editing={courses.editingId !== null}
        updateForm={courses.updateForm}
        onSubmit={courses.submitForm}
        onClose={courses.closeModal}
      />

    </div>
  );
}