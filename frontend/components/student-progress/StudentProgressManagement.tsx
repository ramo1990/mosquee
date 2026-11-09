
"use client";

import { useStudentProgress } from "./useStudentProgress";

import StudentProgressStats from "./StudentProgressStats";
import StudentProgressFilters from "./StudentProgressFilters";
import StudentProgressTable from "./StudentProgressTable";
import StudentProgressModal from "./StudentProgressModal";

export default function StudentProgressManagement() {
  const {
    students,
    classrooms,
    filteredProgress,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    classroomFilter,
    setClassroomFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    averageScore,
    studentsWithProgress,
    studentsWithoutProgress,

    loadData,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    deleteProgress,
  } = useStudentProgress();

  return (
    <div className="space-y-6">
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
            Suivi des élèves
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Suivez la progression, les résultats et les difficultés des élèves.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadData}
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
            Nouvelle évaluation
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <StudentProgressStats
        studentsWithProgress={studentsWithProgress}
        studentsWithoutProgress={studentsWithoutProgress}
        averageScore={averageScore}
        classroomsCount={classrooms.length}
      />

      {/* Modal */}
      <StudentProgressModal
        open={showForm}
        students={students}
        form={form}
        editingId={editingId}
        saving={saving}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      {/* Filtres */}
      <StudentProgressFilters
        search={search}
        setSearch={setSearch}
        classroomFilter={classroomFilter}
        setClassroomFilter={setClassroomFilter}
        classrooms={classrooms}
      />

      {/* Tableau */}
      <StudentProgressTable
        records={filteredProgress}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditForm}
        onDelete={deleteProgress}
      />
    </div>
  );
}
