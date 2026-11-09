"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";

type TaskPriority = "low" | "medium" | "high" | "urgent";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: number | null;
  assigned_to_name?: string;
  due_date?: string;
  is_active: boolean;
};

type Member = {
  id: number;
  first_name: string;
  last_name: string;
};

type TaskForm = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string;
  due_date: string;
};

const EMPTY_FORM: TaskForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigned_to: "",
  due_date: "",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: TaskStatus[] = [
  "todo",
  "in_progress",
  "done",
  "cancelled",
];

const PRIORITY_OPTIONS: TaskPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];

export default function TasksManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | TaskPriority
  >("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksData, membersData] = await Promise.all([
        apiGetList<Task[]>("/tasks/"),
        apiGetList<Member[]>("/users/"),
      ]);

      setTasks(tasksData);
      setMembers(membersData);
    } catch (err) {
      console.error("Erreur chargement des tâches :", err);
      setTasks([]);
      setMembers([]);
      setError("Impossible de charger les tâches pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [tasksData, membersData] = await Promise.all([
          apiGetList<Task[]>("/tasks/"),
          apiGetList<Member[]>("/users/"),
        ]);

        if (!ignore) {
          setTasks(tasksData);
          setMembers(membersData);
        }
      } catch (err) {
        console.error("Erreur chargement des tâches :", err);

        if (!ignore) {
          setTasks([]);
          setMembers([]);
          setError("Impossible de charger les tâches pour le moment.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        [
          task.title,
          task.description,
          task.assigned_to_name,
          task.due_date,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "all" ||
        String(task.assigned_to) === assigneeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter]);

  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  function updateForm(field: keyof TaskForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(task: Task) {
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to ? String(task.assigned_to) : "",
      due_date: task.due_date ?? "",
    });

    setEditingId(task.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      due_date: form.due_date || undefined,
    };

    try {
      if (editingId) {
        const updatedTask = await apiPatch<Task>(
          `/tasks/${editingId}/`,
          payload
        );

        setTasks((current) =>
          current.map((task) =>
            task.id === editingId
              ? { ...task, ...updatedTask }
              : task
          )
        );

        setSuccess("Tâche modifiée avec succès.");
      } else {
        const createdTask = await apiPost<Task>("/tasks/", payload);

        setTasks((current) => [createdTask, ...current]);
        setSuccess("Tâche créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la tâche :", err);
      setError(
        editingId
          ? "Impossible de modifier cette tâche."
          : "Impossible de créer cette tâche."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    setError("");
    setSuccess("");
    setUpdatingId(task.id);

    try {
      await apiPatch(`/tasks/${task.id}/`, {
        status,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? { ...item, status }
            : item
        )
      );

      setSuccess(`Tâche marquée comme « ${STATUS_LABELS[status]} ».`);
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cette tâche.");
    } finally {
      setUpdatingId(null);
    }
  }

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="À faire" value={todoCount} />
        <StatCard title="En cours" value={inProgressCount} />
        <StatCard title="Terminées" value={doneCount} />
        <StatCard title="Total tâches" value={tasks.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? "Modifier la tâche" : "Créer une nouvelle tâche"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Préparer la réunion du comité"
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Détails de la tâche"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm("status", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priorité
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Assignée à
              </label>

              <select
                value={form.assigned_to}
                onChange={(event) =>
                  updateForm("assigned_to", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non assignée</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Échéance"
              type="date"
              value={form.due_date}
              onChange={(value) => updateForm("due_date", value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setShowForm(false);
              }}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Enregistrer les modifications"
                  : "Créer la tâche"}
            </button>
          </div>
        </form>
      )}

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

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des tâches</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredTasks.length} tâche(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune tâche trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle tâche ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Tâche</th>
                  <th className="px-6 py-4">Responsable</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Échéance</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => {
                  const isUpdating = updatingId === task.id;

                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {task.title}
                        </div>

                        {task.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {task.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {task.assigned_to_name || "Non assignée"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${PRIORITY_COLORS[task.priority]}`}
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {task.due_date || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[task.status]}`}
                        >
                          {STATUS_LABELS[task.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(task)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          {task.status !== "done" && (
                            <button
                              type="button"
                              onClick={() => changeStatus(task, "done")}
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Modification..."
                                : "Terminer"}
                            </button>
                          )}

                          {task.status !== "in_progress" &&
                            task.status !== "done" && (
                              <button
                                type="button"
                                onClick={() =>
                                  changeStatus(task, "in_progress")
                                }
                                disabled={isUpdating}
                                className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                              >
                                Démarrer
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">{value}</p>
    </div>
  );
}