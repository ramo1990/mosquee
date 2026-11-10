
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Task,
  Member,
  TaskForm,
  TaskStatus,
  TaskPriority,
  EMPTY_FORM,
  STATUS_LABELS,
} from "./types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | TaskStatus>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<"all" | TaskPriority>("all");

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
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    assigneeFilter,
  ]);

  const todoCount = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const doneCount = tasks.filter(
    (task) => task.status === "done"
  ).length;

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
      assigned_to: task.assigned_to
        ? String(task.assigned_to)
        : "",
      due_date: task.due_date ?? "",
    });

    setEditingId(task.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
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
      assigned_to: form.assigned_to
        ? Number(form.assigned_to)
        : null,
      due_date: form.due_date || undefined,
    };

    try {
      if (editingId !== null) {
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
        const createdTask = await apiPost<Task>(
          "/tasks/",
          payload
        );

        setTasks((current) => [createdTask, ...current]);

        setSuccess("Tâche créée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement de la tâche :", err);

      setError(
        editingId !== null
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

      setSuccess(
        `Tâche marquée comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);

      setError("Impossible de modifier le statut de cette tâche.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
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
  };
}