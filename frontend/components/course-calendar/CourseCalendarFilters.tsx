
import {
  Classroom,
  CalendarEventType,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_OPTIONS,
} from "./types";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  eventTypeFilter: "all" | CalendarEventType;
  setEventTypeFilter: (value: "all" | CalendarEventType) => void;

  classroomFilter: string;
  setClassroomFilter: (value: string) => void;

  classrooms: Classroom[];
};

export default function CourseCalendarFilters({
  search,
  setSearch,
  eventTypeFilter,
  setEventTypeFilter,
  classroomFilter,
  setClassroomFilter,
  classrooms,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un événement..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={eventTypeFilter}
        onChange={(event) =>
          setEventTypeFilter(
            event.target.value as "all" | CalendarEventType
          )
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      >
        <option value="all">Tous les types</option>

        {EVENT_TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {EVENT_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <select
        value={classroomFilter}
        onChange={(event) => setClassroomFilter(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
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