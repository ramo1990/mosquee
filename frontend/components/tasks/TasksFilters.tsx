
"use client";

import {
  Member,
  TaskPriority,
  TaskStatus,
  STATUS_LABELS,
  STATUS_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./types";

type TasksFiltersProps = {
  members: Member[];
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "all" | TaskStatus;
  setStatusFilter: (value: "all" | TaskStatus) => void;
  priorityFilter: "all" | TaskPriority;
  setPriorityFilter: (value: "all" | TaskPriority) => void;
  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;
};

export default function TasksFilters({
  members,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
}: TasksFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_170px_170px_200px]">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher une tâche..."
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as "all" | TaskStatus)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les statuts</option>

        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        value={priorityFilter}
        onChange={(event) =>
          setPriorityFilter(event.target.value as "all" | TaskPriority)
        }
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Toutes les priorités</option>

        {PRIORITY_OPTIONS.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>

      <select
        value={assigneeFilter}
        onChange={(event) => setAssigneeFilter(event.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
      >
        <option value="all">Tous les responsables</option>

        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.first_name} {member.last_name}
          </option>
        ))}
      </select>
    </div>
  );
}