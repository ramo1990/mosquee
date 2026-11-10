
"use client";

import { useAttendance } from "./useAttendance";

import AttendanceStats from "./AttendanceStats";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import AttendanceActions from "./AttendanceActions";

export default function AttendanceManagement() {
  const {
    students,
    classrooms,
    attendance,
    loading,
    saving,
    selectedDate,
    selectedClassroom,
    error,
    success,
    filteredStudents,
    statusCounts,
    setSelectedDate,
    setSelectedClassroom,
    setError,
    setSuccess,
    loadAttendanceData,
    updateAttendance,
    setAllStatus,
    saveAttendance,
  } = useAttendance();

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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Gestion des présences
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enregistrez les présences, absences et retards des élèves.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAttendanceData}
          disabled={loading}
          className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      <AttendanceStats counts={statusCounts} />

      <AttendanceFilters
        selectedDate={selectedDate}
        selectedClassroom={selectedClassroom}
        classrooms={classrooms}
        onDateChange={(value) => {
          setSelectedDate(value);
          setError("");
          setSuccess("");
        }}
        onClassroomChange={(value) => {
          setSelectedClassroom(value);
          setError("");
          setSuccess("");
        }}
      />

      <AttendanceActions
        saving={saving}
        loading={loading}
        onSetAllStatus={setAllStatus}
        onSave={saveAttendance}
      />

      <AttendanceTable
        students={filteredStudents}
        attendance={attendance}
        selectedDate={selectedDate}
        loading={loading}
        onUpdate={updateAttendance}
      />
    </div>
  );
}
