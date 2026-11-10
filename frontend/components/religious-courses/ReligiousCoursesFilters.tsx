
import {
  CourseSubject,
  SubjectFilter,
  StatusFilter,
  SUBJECT_LABELS,
  SUBJECT_OPTIONS,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  subjectFilter: SubjectFilter;
  setSubjectFilter: (value: SubjectFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
};

export default function ReligiousCoursesFilters({
  search,
  setSearch,
  subjectFilter,
  setSubjectFilter,
  statusFilter,
  setStatusFilter,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un cours..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={subjectFilter}
        onChange={(event) =>
          setSubjectFilter(event.target.value as SubjectFilter)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les matières</option>

        {SUBJECT_OPTIONS.map((subject: CourseSubject) => (
          <option key={subject} value={subject}>
            {SUBJECT_LABELS[subject]}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as StatusFilter)
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