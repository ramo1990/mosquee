
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Expense,
  ExpenseForm,
  ExpenseFormField,
  ExpenseStatus,
  EMPTY_FORM,
  STATUS_LABELS,
} from "./types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ExpenseStatus
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpenseForm>(EMPTY_FORM);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Expense[]>("/expenses/");
      setExpenses(data);
    } catch (err) {
      console.error("Erreur chargement des dépenses :", err);
      setExpenses([]);
      setError("Impossible de charger les dépenses pour le moment.");
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
        const data = await apiGetList<Expense[]>("/expenses/");

        if (!ignore) {
          setExpenses(data);
        }
      } catch (err) {
        console.error("Erreur chargement des dépenses :", err);

        if (!ignore) {
          setExpenses([]);
          setError("Impossible de charger les dépenses pour le moment.");
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

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    expenses.forEach((expense) => {
      if (expense.category) {
        categories.add(expense.category);
      }
    });

    return Array.from(categories).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return expenses
      .filter((expense) => {
        const matchesSearch =
          !query ||
          [
            expense.title,
            expense.category,
            expense.payment_method,
            expense.notes,
            expense.expense_date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesCategory =
          categoryFilter === "all" ||
          expense.category === categoryFilter;

        const matchesStatus =
          statusFilter === "all" ||
          expense.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.expense_date ?? "";
        const dateB = b.expense_date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [expenses, search, categoryFilter, statusFilter]);

  const totalExpenses = expenses
    .filter((expense) => expense.status === "paid")
    .reduce((total, expense) => total + (expense.amount ?? 0), 0);

  const pendingCount = expenses.filter(
    (expense) => expense.status === "pending"
  ).length;

  const approvedCount = expenses.filter(
    (expense) => expense.status === "approved"
  ).length;

  function updateForm(field: ExpenseFormField, value: string) {
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

  function openEditForm(expense: Expense) {
    setForm({
      title: expense.title,
      category: expense.category ?? "",
      amount: expense.amount ? String(expense.amount) : "",
      expense_date: expense.expense_date ?? "",
      payment_method: expense.payment_method ?? "",
      status: expense.status,
      notes: expense.notes ?? "",
    });

    setEditingId(expense.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    if (saving) return;

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || undefined,
      amount: Number(form.amount),
      expense_date: form.expense_date || undefined,
      payment_method: form.payment_method.trim() || undefined,
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedExpense = await apiPatch<Expense>(
          `/expenses/${editingId}/`,
          payload
        );

        setExpenses((current) =>
          current.map((expense) =>
            expense.id === editingId
              ? { ...expense, ...updatedExpense }
              : expense
          )
        );

        setSuccess("Dépense modifiée avec succès.");
      } else {
        const createdExpense = await apiPost<Expense>(
          "/expenses/",
          payload
        );

        setExpenses((current) => [
          createdExpense,
          ...current,
        ]);

        setSuccess("Dépense enregistrée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la dépense :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier cette dépense."
          : "Impossible d'enregistrer cette dépense."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    expense: Expense,
    status: ExpenseStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(expense.id);

    try {
      const updatedExpense = await apiPatch<Expense>(
        `/expenses/${expense.id}/`,
        { status }
      );

      setExpenses((current) =>
        current.map((item) =>
          item.id === expense.id
            ? { ...item, ...updatedExpense }
            : item
        )
      );

      setSuccess(
        `Dépense marquée comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cette dépense.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    expenses,
    loading,
    saving,
    updatingId,

    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    availableCategories,
    filteredExpenses,

    totalExpenses,
    pendingCount,
    approvedCount,

    loadExpenses,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    updateStatus,
  };
}
