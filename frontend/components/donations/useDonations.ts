
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPatch, apiPost } from "@/lib/api";

export type Donation = {
  id: number;
  donor_name: string;
  amount: number | string;
  phone: string;
  project_name: string;
  donation_date: string;
  status: "pending" | "received";
  notes: string;
};

export type DonationForm = {
  donor_name: string;
  amount: string;
  phone: string;
  project_name: string;
  donation_date: string;
  status: string;
  notes: string;
};

const EMPTY_FORM: DonationForm = {
  donor_name: "",
  amount: "",
  phone: "",
  project_name: "",
  donation_date: new Date().toLocaleDateString("en-CA"),
  status: "received",
  notes: "",
};

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [form, setForm] = useState<DonationForm>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGetList<Donation>("/donations/");
      setDonations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les dons."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDonations();
  }, [loadDonations]);

  const availableProjects = useMemo(() => {
    return Array.from(
      new Set(
        donations
          .map((donation) => donation.project_name?.trim())
          .filter((project): project is string => Boolean(project))
      )
    ).sort((a, b) => a.localeCompare(b, "fr"));
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        donation.donor_name?.toLowerCase().includes(searchText) ||
        donation.phone?.toLowerCase().includes(searchText) ||
        donation.project_name?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        donation.status === statusFilter;

      const matchesProject =
        projectFilter === "all" ||
        donation.project_name === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [donations, search, statusFilter, projectFilter]);

  const receivedDonations = useMemo(
    () => donations.filter((donation) => donation.status === "received"),
    [donations]
  );

  const totalReceived = receivedDonations.reduce(
    (total, donation) => total + Number(donation.amount || 0),
    0
  );

  const receivedCount = receivedDonations.length;

  const pendingCount = donations.filter(
    (donation) => donation.status === "pending"
  ).length;

  function updateForm(field: keyof DonationForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
    setSuccess(null);
    setShowForm(true);
  }

  function openEditForm(donation: Donation) {
    setEditingId(donation.id);

    setForm({
      donor_name: donation.donor_name ?? "",
      amount: String(donation.amount ?? ""),
      phone: donation.phone ?? "",
      project_name: donation.project_name ?? "",
      donation_date: donation.donation_date ?? "",
      status: donation.status ?? "pending",
      notes: donation.notes ?? "",
    });

    setError(null);
    setSuccess(null);
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!form.donor_name.trim()) {
      setError("Veuillez renseigner le nom du donateur.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Veuillez saisir un montant valide.");
      return;
    }

    setSaving(true);

    const payload = {
      donor_name: form.donor_name.trim(),
      amount: Number(form.amount),
      phone: form.phone.trim(),
      project_name: form.project_name.trim(),
      donation_date: form.donation_date,
      status: form.status,
      notes: form.notes.trim(),
    };

    try {
      if (editingId !== null) {
        await apiPatch<Donation>(
          `/donations/${editingId}/`,
          payload
        );

        setSuccess("Don modifié avec succès.");
      } else {
        await apiPost<Donation>("/donations/", payload);
        setSuccess("Don enregistré avec succès.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });

      await loadDonations();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le don."
      );
    } finally {
      setSaving(false);
    }
  }

  async function markAsReceived(id: number) {
    setError(null);
    setSuccess(null);
    setUpdatingId(id);

    try {
      await apiPatch<Donation>(`/donations/${id}/`, {
        status: "received",
      });

      setSuccess("Le don a été confirmé avec succès.");
      await loadDonations();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de confirmer ce don."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    donations,
    filteredDonations,
    availableProjects,

    form,
    showForm,
    editingId,

    loading,
    saving,
    updatingId,

    error,
    success,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,

    totalReceived,
    receivedCount,
    pendingCount,

    updateForm,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    markAsReceived,
    loadDonations,
  };
}