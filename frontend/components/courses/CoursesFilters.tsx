"use client";

import { Teacher } from "./types";

type Props = {
  search: string;
  subjectFilter: string;
  teacherFilter: string;
  statusFilter: "all" | "active" | "inactive";
  availableSubjects: string[];
  teachers: Teacher[];

  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onStatusChange: (
    value: "all" | "active" | "inactive"
  ) => void;
};

export default function CoursesFilters({
  search,
  subjectFilter,
  teacherFilter,
  statusFilter,
  availableSubjects,
  teachers,
  onSearchChange,
  onSubjectChange,
  onTeacherChange,
  onStatusChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_200px_180px]">

      <input
        type="search"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Rechercher un cours..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={subjectFilter}
        onChange={(event) =>
          onSubjectChange(event.target.value)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les matières</option>

        {availableSubjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      <select
        value={teacherFilter}
        onChange={(event) =>
          onTeacherChange(event.target.value)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les enseignants</option>

        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.first_name} {teacher.last_name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as
              | "all"
              | "active"
              | "inactive"
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
    </div>
  );
}