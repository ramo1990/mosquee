
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList } from "@/lib/api";

import {
  FinancialTransaction,
  FinanceSummaryData,
  FinanceFilters,
  EMPTY_FILTERS,
  EMPTY_SUMMARY,
} from "./types";

export function useFinance() {
  const [transactions, setTransactions] = useState<
    FinancialTransaction[]
  >([]);

  const [summary, setSummary] =
    useState<FinanceSummaryData>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] =
    useState<FinanceFilters>(EMPTY_FILTERS);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Chargement des données financières
  const loadFinanceData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [transactionsData, summaryData] = await Promise.all([
        apiGetList<FinancialTransaction[]>(
          "/financial-transactions/"
        ),
        apiGetList<FinanceSummaryData[]>(
          "/finance-summary/"
        ),
      ]);

      setTransactions(transactionsData);
      setSummary(summaryData[0] ?? EMPTY_SUMMARY);

      setSuccess("Rapport financier actualisé.");
    } catch (err) {
      console.error(
        "Erreur chargement des données financières :",
        err
      );

      setTransactions([]);
      setSummary(EMPTY_SUMMARY);

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
          apiGetList<FinancialTransaction[]>(
            "/financial-transactions/"
          ),
          apiGetList<FinanceSummaryData[]>(
            "/finance-summary/"
          ),
        ]);

        if (!ignore) {
          setTransactions(transactionsData);
          setSummary(summaryData[0] ?? EMPTY_SUMMARY);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des données financières :",
          err
        );

        if (!ignore) {
          setTransactions([]);
          setSummary(EMPTY_SUMMARY);

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

  // Catégories disponibles
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    transactions.forEach((transaction) => {
      if (transaction.category) {
        categories.add(transaction.category);
      }
    });

    return Array.from(categories).sort();
  }, [transactions]);

  // Transactions filtrées
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesType =
          filters.transaction_type === "all" ||
          transaction.transaction_type ===
            filters.transaction_type;

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

  // Calcul des recettes filtrées
  const filteredIncome = useMemo(
    () =>
      filteredTransactions
        .filter(
          (transaction) =>
            transaction.transaction_type === "income"
        )
        .reduce(
          (total, transaction) => total + transaction.amount,
          0
        ),
    [filteredTransactions]
  );

  // Calcul des dépenses filtrées
  const filteredExpenses = useMemo(
    () =>
      filteredTransactions
        .filter(
          (transaction) =>
            transaction.transaction_type === "expense"
        )
        .reduce(
          (total, transaction) => total + transaction.amount,
          0
        ),
    [filteredTransactions]
  );

  const filteredBalance = filteredIncome - filteredExpenses;

  // Modification d'un filtre
  function updateFilter(
    field: keyof FinanceFilters,
    value: string
  ) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Réinitialisation des filtres
  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  // Export CSV
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
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF", csvContent], {
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

  return {
    transactions,
    summary,
    loading,
    filters,
    error,
    success,

    availableCategories,
    filteredTransactions,

    filteredIncome,
    filteredExpenses,
    filteredBalance,

    loadFinanceData,
    updateFilter,
    resetFilters,
    exportCsv,
  };
}