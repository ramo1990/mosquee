import { Classroom } from "./types";

type Props = {
  search: string;
  statusFilter: "all" | "active" | "inactive";
  classroomFilter: string;
  classrooms: Classroom[];

  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  onClassroomChange: (value: string) => void;
};

export default function StudentsFilters({
  search,
  statusFilter,
  classroomFilter,
  classrooms,
  onSearchChange,
  onStatusChange,
  onClassroomChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_220px]">
      <input
        type="search"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Rechercher un élève..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as "all" | "active" | "inactive"
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>

      <select
        value={classroomFilter}
        onChange={(event) =>
          onClassroomChange(event.target.value)
        }
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