"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList } from "@/lib/api";

type TransactionType = "income" | "expense";

type FinancialTransaction = {
  id: number;
  title: string;
  transaction_type: TransactionType;
  amount: number;
  date: string;
  category?: string;
  payment_method?: string;
  notes?: string;
};

type FinanceSummary = {
  total_income: number;
  total_expenses: number;
  balance: number;
};

type FinanceFilters = {
  start_date: string;
  end_date: string;
  transaction_type: "all" | TransactionType;
  category: string;
};

const EMPTY_FILTERS: FinanceFilters = {
  start_date: "",
  end_date: "",
  transaction_type: "all",
  category: "",
};

export default function FinanceManagement() {
  const [transactions, setTransactions] = useState<
    FinancialTransaction[]
  >([]);

  const [summary, setSummary] = useState<FinanceSummary>({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FinanceFilters>(EMPTY_FILTERS);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFinanceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [transactionsData, summaryData] = await Promise.all([
        apiGetList<FinancialTransaction[]>("/financial-transactions/"),
        apiGetList<FinanceSummary[]>("/finance-summary/"),
      ]);

      setTransactions(transactionsData);

      if (summaryData.length > 0) {
        setSummary(summaryData[0]);
      } else {
        setSummary({
          total_income: 0,
          total_expenses: 0,
          balance: 0,
        });
      }

      setSuccess("Rapport financier actualisé.");
    } catch (err) {
      console.error("Erreur chargement des données financières :", err);
      setTransactions([]);
      setSummary({
        total_income: 0,
        total_expenses: 0,
        balance: 0,
      });
      setError(
        "Impossible de charger les données financières pour le moment."
      );
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
        const [transactionsData, summaryData] = await Promise.all([
          apiGetList<FinancialTransaction[]>("/financial-transactions/"),
          apiGetList<FinanceSummary[]>("/finance-summary/"),
        ]);

        if (!ignore) {
          setTransactions(transactionsData);

          if (summaryData.length > 0) {
            setSummary(summaryData[0]);
          } else {
            setSummary({
              total_income: 0,
              total_expenses: 0,
              balance: 0,
            });
          }
        }
      } catch (err) {
        console.error(
          "Erreur chargement des données financières :",
          err
        );

        if (!ignore) {
          setTransactions([]);
          setSummary({
            total_income: 0,
            total_expenses: 0,
            balance: 0,
          });
          setError(
            "Impossible de charger les données financières pour le moment."
          );
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

    transactions.forEach((transaction) => {
      if (transaction.category) {
        categories.add(transaction.category);
      }
    });

    return Array.from(categories).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesType =
          filters.transaction_type === "all" ||
          transaction.transaction_type === filters.transaction_type;

        const matchesCategory =
          !filters.category ||
          transaction.category === filters.category;

        const matchesStartDate =
          !filters.start_date ||
          transaction.date >= filters.start_date;

        const matchesEndDate =
          !filters.end_date ||
          transaction.date <= filters.end_date;

        return (
          matchesType &&
          matchesCategory &&
          matchesStartDate &&
          matchesEndDate
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  const filteredIncome = filteredTransactions
    .filter(
      (transaction) => transaction.transaction_type === "income"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const filteredExpenses = filteredTransactions
    .filter(
      (transaction) => transaction.transaction_type === "expense"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const filteredBalance = filteredIncome - filteredExpenses;

  function updateFilter(
    field: keyof FinanceFilters,
    value: string
  ) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function exportCsv() {
    const headers = [
      "Date",
      "Type",
      "Titre",
      "Catégorie",
      "Montant",
      "Mode de paiement",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.transaction_type === "income"
        ? "Recette"
        : "Dépense",
      transaction.title,
      transaction.category ?? "",
      transaction.amount,
      transaction.payment_method ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rapport-financier-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
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
            Finances et rapports
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez les recettes, dépenses, soldes et rapports financiers de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadFinanceData}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || filteredTransactions.length === 0}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            Exporter en CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Recettes totales"
          value={summary.total_income}
          prefix="€"
        />

        <StatCard
          title="Dépenses totales"
          value={summary.total_expenses}
          prefix="€"
        />

        <StatCard
          title="Solde global"
          value={summary.balance}
          prefix="€"
        />

        <StatCard
          title="Solde filtré"
          value={filteredBalance}
          prefix="€"
        />
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[170px_170px_180px_1fr_120px]">
        <FormField
          label="Du"
          type="date"
          value={filters.start_date}
          onChange={(value) => updateFilter("start_date", value)}
        />

        <FormField
          label="Au"
          type="date"
          value={filters.end_date}
          onChange={(value) => updateFilter("end_date", value)}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Type
          </label>

          <select
            value={filters.transaction_type}
            onChange={(event) =>
              updateFilter("transaction_type", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="all">Tous</option>
            <option value="income">Recettes</option>
            <option value="expense">Dépenses</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Catégorie
          </label>

          <select
            value={filters.category}
            onChange={(event) =>
              updateFilter("category", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Toutes les catégories</option>

            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          title="Recettes filtrées"
          amount={filteredIncome}
        />

        <SummaryCard
          title="Dépenses filtrées"
          amount={filteredExpenses}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Historique des transactions
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredTransactions.length} transaction(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune transaction trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Modifiez les filtres ou enregistrez des transactions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Paiement</th>
                  <th className="px-6 py-4 text-right">Montant</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {transaction.title}
                      </div>

                      {transaction.notes && (
                        <div className="mt-1 max-w-md text-xs text-gray-500">
                          {transaction.notes}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {transaction.category || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {transaction.payment_method || "—"}
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        transaction.transaction_type === "income"
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type === "income"
                        ? "+"
                        : "-"}
                      {transaction.amount} €
                    </td>
                  </tr>
                ))}
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

function SummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-2xl font-extrabold text-gray-950">
        {amount} €
      </p>
    </div>
  );
}