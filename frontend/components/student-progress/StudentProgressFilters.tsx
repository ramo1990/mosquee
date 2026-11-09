
import { Classroom } from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  classroomFilter: string;
  setClassroomFilter: (value: string) => void;
  classrooms: Classroom[];
};

export default function StudentProgressFilters({
  search,
  setSearch,
  classroomFilter,
  setClassroomFilter,
  classrooms,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un élève, une appréciation ou une difficulté..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={classroomFilter}
        onChange={(event) => setClassroomFilter(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les classes</option>

        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
    </div>
  );
}