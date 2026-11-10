
import {
  CalendarEvent,
  EVENT_TYPE_COLORS,
  WEEK_DAYS,
  formatDate,
} from "./types";

type Props = {
  weekDays: Date[];
  currentWeekStart: Date;
  eventsByDay: Record<string, CalendarEvent[]>;
  filteredEventsCount: number;
  loading: boolean;

  onChangeWeek: (direction: -1 | 1) => void;
  onCreate: (date: Date) => void;
  onEdit: (event: CalendarEvent) => void;
};

export default function CourseCalendarView({
  weekDays,
  currentWeekStart,
  eventsByDay,
  filteredEventsCount,
  loading,
  onChangeWeek,
  onCreate,
  onEdit,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-bold text-gray-900">
            Semaine du {formatDate(currentWeekStart)}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredEventsCount} événement(s) cette semaine
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChangeWeek(-1)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Semaine précédente
          </button>

          <button
            type="button"
            onClick={() => onChangeWeek(1)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Semaine suivante
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-7">
          {weekDays.map((day, index) => {
            const dayKey = formatDate(day);
            const dayEvents = eventsByDay[dayKey] ?? [];

            return (
              <div
                key={dayKey}
                className="min-h-[220px] rounded-2xl border border-gray-200 bg-gray-50 p-3"
              >
                <div className="text-xs font-bold uppercase text-gray-500">
                  {WEEK_DAYS[index]}
                </div>

                <div className="mt-1 text-sm font-extrabold text-gray-900">
                  {day.getDate()}/{day.getMonth() + 1}
                </div>

                <div className="mt-3 space-y-2">
                  {dayEvents.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      Aucun événement
                    </p>
                  ) : (
                    dayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEdit(event)}
                        className={`w-full rounded-xl border p-3 text-left text-xs font-semibold hover:opacity-80 ${EVENT_TYPE_COLORS[event.event_type]}`}
                      >
                        <div className="font-bold">
                          {event.title}
                        </div>

                        <div className="mt-1 text-[11px] font-medium opacity-80">
                          {new Date(
                            event.start_datetime
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(
                            event.end_datetime
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div className="mt-1 text-[11px] opacity-80">
                          {event.classroom_name || "Classe non affectée"}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onCreate(day)}
                  className="mt-3 w-full rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-white"
                >
                  + Ajouter
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}