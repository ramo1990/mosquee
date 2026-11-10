
"use client";

import {
  AssignmentStatusFilter,
  AssignmentTypeFilter,
  Classroom,
  TYPE_LABELS,
  TYPE_OPTIONS,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  typeFilter: AssignmentTypeFilter;
  setTypeFilter: (value: AssignmentTypeFilter) => void;

  classroomFilter: string;
  setClassroomFilter: (value: string) => void;

  statusFilter: AssignmentStatusFilter;
  setStatusFilter: (value: AssignmentStatusFilter) => void;

  classrooms: Classroom[];
};

export default function AssignmentsFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  classroomFilter,
  setClassroomFilter,
  statusFilter,
  setStatusFilter,
  classrooms,
}: Props) {
  const inputClass =
    "rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px_180px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un devoir ou une évaluation..."
        className={inputClass}
      />

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value as AssignmentTypeFilter)
        }
        className={inputClass}
      >
        <option value="all">Tous les types</option>

        {TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <select
        value={classroomFilter}
        onChange={(event) => setClassroomFilter(event.target.value)}
        className={inputClass}
      >
        <option value="all">Toutes les classes</option>

        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as AssignmentStatusFilter)
        }
        className={inputClass}
      >
        <option value="all">Tous les statuts</option>
        <option value="published">Publiés</option>
        <option value="draft">Brouillons</option>
      </select>
    </div>
  );
}