
import { Member, Task, TaskPriority, TaskStatus } from "./types";
import TasksFilters from "./TasksFilters";
import TasksTable from "./TasksTable";

type TasksViewProps = {
  members: Member[];
  tasks: Task[];
  loading: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  statusFilter: "all" | TaskStatus;
  setStatusFilter: (value: "all" | TaskStatus) => void;

  priorityFilter: "all" | TaskPriority;
  setPriorityFilter: (value: "all" | TaskPriority) => void;

  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;

  onEdit: (task: Task) => void;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
};

export default function TasksView(props: TasksViewProps) {
  return (
    <div className="space-y-4">
      <TasksFilters
        members={props.members}
        search={props.search}
        setSearch={props.setSearch}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        priorityFilter={props.priorityFilter}
        setPriorityFilter={props.setPriorityFilter}
        assigneeFilter={props.assigneeFilter}
        setAssigneeFilter={props.setAssigneeFilter}
      />

      <TasksTable
        tasks={props.tasks}
        loading={props.loading}
        updatingId={props.updatingId}
        onEdit={props.onEdit}
        onChangeStatus={props.onChangeStatus}
      />
    </div>
  );
}