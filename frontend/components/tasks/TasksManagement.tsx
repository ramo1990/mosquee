
"use client";

import { useTasks } from "./useTasks";

import TasksStats from "./TasksStats";
import TasksView from "./TasksView";
import TasksModal from "./TasksModal";

export default function TasksManagement() {
  const {
    tasks,
    members,
    filteredTasks,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    priorityFilter,
    setPriorityFilter,

    assigneeFilter,
    setAssigneeFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    todoCount,
    inProgressCount,
    doneCount,

    loadTasks,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    changeStatus,
  } = useTasks();

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Tâches du comité
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez, attribuez et suivez les tâches administratives du comité.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadTasks}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Créer une tâche
          </button>
        </div>
      </div>

      <TasksStats
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        doneCount={doneCount}
        totalCount={tasks.length}
      />

      <TasksModal
        open={showForm}
        editingId={editingId}
        form={form}
        members={members}
        saving={saving}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      <TasksView
        members={members}
        tasks={filteredTasks}
        loading={loading}
        updatingId={updatingId}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        onEdit={openEditForm}
        onChangeStatus={changeStatus}
      />
    </div>
  );
}