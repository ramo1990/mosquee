"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type ExpenseStatus = "pending" | "approved" | "rejected" | "paid";

type Expense = {
  id: number;
  title: string;
  category?: string;
  amount: number;
  expense_date?: string;
  payment_method?: string;
  status: ExpenseStatus;
  notes?: string;
  is_active: boolean;
};

type ExpenseForm = {
  title: string;
  category: string;
  amount: string;
  expense_date: string;
  payment_method: string;
  status: ExpenseStatus;
  notes: string;
};

const EMPTY_FORM: ExpenseForm = {
  title: "",
  category: "",
  amount: "",
  expense_date: "",
  payment_method: "",
  status: "pending",
  notes: "",
};

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  pending: "En attente",
  approved: "Validée",
  rejected: "Refusée",
  paid: "Payée",
};

const STATUS_COLORS: Record<ExpenseStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-800",
};

const STATUS_OPTIONS: ExpenseStatus[] = [
  "pending",
  "approved",
  "rejected",
  "paid",
];

export default function ExpensesManagement() {
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
          categoryFilter === "all" || expense.category === categoryFilter;

        const matchesStatus =
          statusFilter === "all" || expense.status === statusFilter;

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

  function updateForm(field: keyof ExpenseForm, value: string) {
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
      if (editingId) {
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

        setExpenses((current) => [createdExpense, ...current]);
        setSuccess("Dépense enregistrée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la dépense :", err);
      setError(
        editingId
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
        {
          status,
        }
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
            Dépenses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enregistrez et suivez les dépenses liées au fonctionnement et aux projets de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadExpenses}
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
            Nouvelle dépense
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total payé"
          value={totalExpenses}
          prefix="€"
        />

        <StatCard title="En attente" value={pendingCount} />
        <StatCard title="Validées" value={approvedCount} />
        <StatCard title="Catégories" value={availableCategories.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier la dépense"
              : "Enregistrer une nouvelle dépense"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Achat de fournitures"
                required
              />
            </div>

            <FormField
              label="Catégorie"
              value={form.category}
              onChange={(value) => updateForm("category", value)}
              placeholder="Exemple : Fonctionnement, projet, maintenance"
            />

            <FormField
              label="Montant"
              type="number"
              value={form.amount}
              onChange={(value) => updateForm("amount", value)}
              placeholder="Exemple : 250"
              required
            />

            <FormField
              label="Date de dépense"
              type="date"
              value={form.expense_date}
              onChange={(value) => updateForm("expense_date", value)}
            />

            <FormField
              label="Mode de paiement"
              value={form.payment_method}
              onChange={(value) =>
                updateForm("payment_method", value)
              }
              placeholder="Exemple : Espèces, virement, chèque"
            />

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

            <div className="md:col-span-2">
              <FormField
                label="Notes"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Précisions sur la dépense"
              />
            </div>
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
                  : "Enregistrer la dépense"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une dépense..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les catégories</option>

          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | ExpenseStatus
            )
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des dépenses
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredExpenses.length} dépense(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune dépense trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Enregistrez une nouvelle dépense ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Dépense</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Paiement</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => {
                  const isUpdating = updatingId === expense.id;

                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {expense.title}
                        </div>

                        {expense.notes && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {expense.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {expense.category || "—"}
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        {expense.amount} €
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {expense.expense_date || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {expense.payment_method || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[expense.status]}`}
                        >
                          {STATUS_LABELS[expense.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(expense)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          {expense.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(expense, "approved")
                                }
                                disabled={isUpdating}
                                className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                              >
                                Valider
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(expense, "rejected")
                                }
                                disabled={isUpdating}
                                className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                              >
                                Refuser
                              </button>
                            </>
                          )}

                          {expense.status === "approved" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(expense, "paid")
                              }
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              Marquer payée
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
  prefix,
}: {
  title: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {prefix}
        {value}
      </p>
    </div>
  );
}