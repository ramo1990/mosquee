
import { Classroom } from "./types";

type Props = {
  selectedDate: string;
  selectedClassroom: string;
  classrooms: Classroom[];
  onDateChange: (value: string) => void;
  onClassroomChange: (value: string) => void;
};

export default function AttendanceFilters({
  selectedDate,
  selectedClassroom,
  classrooms,
  onDateChange,
  onClassroomChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[200px_1fr]">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Classe
        </label>

        <select
          value={selectedClassroom}
          onChange={(event) => onClassroomChange(event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        >
          <option value="all">Toutes les classes</option>

          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}