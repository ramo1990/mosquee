"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Contribution,
  ContributionForm,
  ContributionStatusFilter,
  EMPTY_FORM,
  Member,
} from "./types";

export function useContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ContributionStatusFilter>("all");
  const [memberFilter, setMemberFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContributionForm>(EMPTY_FORM);

  // Chargement des cotisations et des membres
  const loadContributions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [contributionsData, membersData] = await Promise.all([
        apiGetList<Contribution[]>("/contributions/"),
        apiGetList<Member[]>("/users/"),
      ]);

      setContributions(contributionsData);
      setMembers(membersData);
    } catch (err) {
      console.error("Erreur chargement des cotisations :", err);

      setContributions([]);
      setMembers([]);

      setError(
        "Impossible de charger les cotisations pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContributions();
  }, [loadContributions]);

  // Filtrage
  const filteredContributions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return contributions
      .filter((contribution) => {
        const matchesSearch =
          !query ||
          [
            contribution.member_name,
            contribution.notes,
            contribution.due_date,
            contribution.paid_date,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "all" ||
          contribution.status === statusFilter;

        const matchesMember =
          memberFilter === "all" ||
          String(contribution.member) === memberFilter;

        return matchesSearch && matchesStatus && matchesMember;
      })
      .sort((a, b) =>
        (a.due_date ?? "").localeCompare(b.due_date ?? "")
      );
  }, [contributions, search, statusFilter, memberFilter]);

  // Statistiques
  const totalExpected = contributions.reduce(
    (total, contribution) =>
      total + (contribution.amount ?? 0),
    0
  );

  const totalPaid = contributions.reduce(
    (total, contribution) =>
      total + (contribution.amount_paid ?? 0),
    0
  );

  const pendingCount = contributions.filter(
    (contribution) => contribution.status === "pending"
  ).length;

  const paidCount = contributions.filter(
    (contribution) => contribution.status === "paid"
  ).length;

  // Gestion du formulaire
  function updateForm(
    field: keyof ContributionForm,
    value: string
  ) {
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

  function openEditForm(contribution: Contribution) {
    setForm({
      member: contribution.member
        ? String(contribution.member)
        : "",
      amount: contribution.amount
        ? String(contribution.amount)
        : "",
      amount_paid: contribution.amount_paid
        ? String(contribution.amount_paid)
        : "",
      due_date: contribution.due_date ?? "",
      paid_date: contribution.paid_date ?? "",
      status: contribution.status,
      notes: contribution.notes ?? "",
    });

    setEditingId(contribution.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  // Création et modification
  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      member: form.member ? Number(form.member) : null,
      amount: Number(form.amount),
      amount_paid: form.amount_paid
        ? Number(form.amount_paid)
        : 0,
      due_date: form.due_date || undefined,
      paid_date: form.paid_date || undefined,
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedContribution =
          await apiPatch<Contribution>(
            `/contributions/${editingId}/`,
            payload
          );

        setContributions((current) =>
          current.map((contribution) =>
            contribution.id === editingId
              ? { ...contribution, ...updatedContribution }
              : contribution
          )
        );

        setSuccess("Cotisation modifiée avec succès.");
      } else {
        const createdContribution =
          await apiPost<Contribution>(
            "/contributions/",
            payload
          );

        setContributions((current) => [
          createdContribution,
          ...current,
        ]);

        setSuccess("Cotisation créée avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error(
        "Erreur enregistrement de la cotisation :",
        err
      );

      setError(
        editingId !== null
          ? "Impossible de modifier cette cotisation."
          : "Impossible de créer cette cotisation."
      );
    } finally {
      setSaving(false);
    }
  }

  // Marquer une cotisation comme payée
  async function markAsPaid(contribution: Contribution) {
    setError("");
    setSuccess("");
    setUpdatingId(contribution.id);

    try {
      const updatedContribution =
        await apiPatch<Contribution>(
          `/contributions/${contribution.id}/`,
          {
            status: "paid",
            amount_paid: contribution.amount,
            paid_date: new Date()
              .toISOString()
              .slice(0, 10),
          }
        );

      setContributions((current) =>
        current.map((item) =>
          item.id === contribution.id
            ? { ...item, ...updatedContribution }
            : item
        )
      );

      setSuccess("Cotisation marquée comme payée.");
    } catch (err) {
      console.error(
        "Erreur paiement de la cotisation :",
        err
      );

      setError(
        "Impossible de marquer cette cotisation comme payée."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    contributions,
    members,
    filteredContributions,

    loading,
    saving,
    updatingId,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    memberFilter,
    setMemberFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    totalExpected,
    totalPaid,
    pendingCount,
    paidCount,

    loadContributions,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    markAsPaid,
  };
}