"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiGetList, apiPost, apiPatch } from "@/lib/api";

import {
  Donation,
  DonationForm,
  DonationFormField,
  DonationStatusFilter,
  EMPTY_FORM,
} from "./types";

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<DonationStatusFilter>("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DonationForm>(EMPTY_FORM);

  // Chargement des dons
  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Donation[]>("/donations/");
      setDonations(data);
    } catch (err) {
      console.error("Erreur chargement des dons :", err);

      setDonations([]);
      setError("Impossible de charger les dons pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDonations();
  }, [loadDonations]);

  // Projets disponibles
  const availableProjects = useMemo(() => {
    const projects = new Set<string>();

    donations.forEach((donation) => {
      if (donation.project) {
        projects.add(donation.project);
      }
    });

    return Array.from(projects).sort();
  }, [donations]);

  // Filtrage
  const filteredDonations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return donations
      .filter((donation) => {
        const matchesSearch =
          !query ||
          [
            donation.donor_name,
            donation.project,
            donation.payment_method,
            donation.notes,
            donation.donation_date,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "all" ||
          donation.status === statusFilter;

        const matchesProject =
          projectFilter === "all" ||
          donation.project === projectFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesProject
        );
      })
      .sort((a, b) =>
        (b.donation_date ?? "").localeCompare(
          a.donation_date ?? ""
        )
      );
  }, [donations, search, statusFilter, projectFilter]);

  // Statistiques
  const totalReceived = donations
    .filter((donation) => donation.status === "received")
    .reduce(
      (total, donation) => total + (donation.amount ?? 0),
      0
    );

  const pendingCount = donations.filter(
    (donation) => donation.status === "pending"
  ).length;

  const receivedCount = donations.filter(
    (donation) => donation.status === "received"
  ).length;

  // Gestion du formulaire
  function updateForm(
    field: DonationFormField,
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

  function openEditForm(donation: Donation) {
    setForm({
      donor_name: donation.donor_name,
      donor: donation.donor
        ? String(donation.donor)
        : "",
      amount: donation.amount
        ? String(donation.amount)
        : "",
      project: donation.project ?? "",
      payment_method: donation.payment_method ?? "",
      donation_date: donation.donation_date ?? "",
      status: donation.status,
      notes: donation.notes ?? "",
    });

    setEditingId(donation.id);
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
      donor_name: form.donor_name.trim(),
      donor: form.donor
        ? Number(form.donor)
        : null,
      amount: Number(form.amount),
      project: form.project.trim() || undefined,
      payment_method:
        form.payment_method.trim() || undefined,
      donation_date: form.donation_date || undefined,
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId !== null) {
        const updatedDonation =
          await apiPatch<Donation>(
            `/donations/${editingId}/`,
            payload
          );

        setDonations((current) =>
          current.map((donation) =>
            donation.id === editingId
              ? { ...donation, ...updatedDonation }
              : donation
          )
        );

        setSuccess("Don modifié avec succès.");
      } else {
        const createdDonation =
          await apiPost<Donation>(
            "/donations/",
            payload
          );

        setDonations((current) => [
          createdDonation,
          ...current,
        ]);

        setSuccess("Don enregistré avec succès.");
      }

      closeForm();
    } catch (err) {
      console.error("Erreur enregistrement du don :", err);

      setError(
        editingId !== null
          ? "Impossible de modifier ce don."
          : "Impossible d'enregistrer ce don."
      );
    } finally {
      setSaving(false);
    }
  }

  // Marquer un don comme reçu
  async function markAsReceived(donation: Donation) {
    setError("");
    setSuccess("");
    setUpdatingId(donation.id);

    try {
      const updatedDonation =
        await apiPatch<Donation>(
          `/donations/${donation.id}/`,
          {
            status: "received",
          }
        );

      setDonations((current) =>
        current.map((item) =>
          item.id === donation.id
            ? { ...item, ...updatedDonation }
            : item
        )
      );

      setSuccess("Don marqué comme reçu.");
    } catch (err) {
      console.error("Erreur réception du don :", err);

      setError("Impossible de marquer ce don comme reçu.");
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    donations,
    filteredDonations,
    availableProjects,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    projectFilter,
    setProjectFilter,

    error,
    success,

    showForm,
    editingId,
    form,

    totalReceived,
    pendingCount,
    receivedCount,

    loadDonations,
    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    markAsReceived,
  };
}