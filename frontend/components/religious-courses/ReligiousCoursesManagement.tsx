
"use client";

import { useReligiousCourses } from "./useReligiousCourses";

import ReligiousCoursesStats from "./ReligiousCoursesStats";
import ReligiousCoursesView from "./ReligiousCoursesView";

export default function ReligiousCoursesManagement() {
  const management = useReligiousCourses();

  return (
    <div className="space-y-6">

      {management.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {management.error}
        </div>
      )}

      {management.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {management.success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Cours religieux
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les cours de Coran, hadith, fiqh et autres enseignements religieux.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={management.loadCourses}
            disabled={management.loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={management.openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Créer un cours
          </button>
        </div>
      </div>

      <ReligiousCoursesStats
        total={management.courses.length}
        active={management.activeCount}
        inactive={management.inactiveCount}
        teachers={management.teachers.length}
      />

      <ReligiousCoursesView management={management} />

    </div>
  );
}
