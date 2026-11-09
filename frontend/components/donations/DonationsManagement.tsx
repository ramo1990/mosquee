"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type DonationStatus = "pending" | "received" | "cancelled";

type Donation = {
  id: number;
  donor_name: string;
  donor?: number | null;
  amount: number;
  project?: string;
  payment_method?: string;
  donation_date?: string;
  status: DonationStatus;
  notes?: string;
  is_active: boolean;
};

type DonationForm = {
  donor_name: string;
  donor: string;
  amount: string;
  project: string;
  payment_method: string;
  donation_date: string;
  status: DonationStatus;
  notes: string;
};

const EMPTY_FORM: DonationForm = {
  donor_name: "",
  donor: "",
  amount: "",
  project: "",
  payment_method: "",
  donation_date: "",
  status: "received",
  notes: "",
};

const STATUS_LABELS: Record<DonationStatus, string> = {
  pending: "En attente",
  received: "Reçu",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<DonationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  received: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: DonationStatus[] = [
  "pending",
  "received",
  "cancelled",
];

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | DonationStatus
  >("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DonationForm>(EMPTY_FORM);

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
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiGetList<Donation[]>("/donations/");

        if (!ignore) {
          setDonations(data);
        }
      } catch (err) {
        console.error("Erreur chargement des dons :", err);

        if (!ignore) {
          setDonations([]);
          setError("Impossible de charger les dons pour le moment.");
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

  const availableProjects = useMemo(() => {
    const projects = new Set<string>();

    donations.forEach((donation) => {
      if (donation.project) {
        projects.add(donation.project);
      }
    });

    return Array.from(projects).sort();
  }, [donations]);

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
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "all" || donation.status === statusFilter;

        const matchesProject =
          projectFilter === "all" || donation.project === projectFilter;

        return matchesSearch && matchesStatus && matchesProject;
      })
      .sort((a, b) => {
        const dateA = a.donation_date ?? "";
        const dateB = b.donation_date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [donations, search, statusFilter, projectFilter]);

  const totalReceived = donations
    .filter((donation) => donation.status === "received")
    .reduce((total, donation) => total + (donation.amount ?? 0), 0);

  const pendingCount = donations.filter(
    (donation) => donation.status === "pending"
  ).length;

  const receivedCount = donations.filter(
    (donation) => donation.status === "received"
  ).length;

  function updateForm(field: keyof DonationForm, value: string) {
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
      donor: donation.donor ? String(donation.donor) : "",
      amount: donation.amount ? String(donation.amount) : "",
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

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      donor_name: form.donor_name.trim(),
      donor: form.donor ? Number(form.donor) : null,
      amount: Number(form.amount),
      project: form.project.trim() || undefined,
      payment_method: form.payment_method.trim() || undefined,
      donation_date: form.donation_date || undefined,
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedDonation = await apiPatch<Donation>(
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
        const createdDonation = await apiPost<Donation>(
          "/donations/",
          payload
        );

        setDonations((current) => [createdDonation, ...current]);
        setSuccess("Don enregistré avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du don :", err);
      setError(
        editingId
          ? "Impossible de modifier ce don."
          : "Impossible d'enregistrer ce don."
      );
    } finally {
      setSaving(false);
    }
  }

  async function markAsReceived(donation: Donation) {
    setError("");
    setSuccess("");
    setUpdatingId(donation.id);

    try {
      const updatedDonation = await apiPatch<Donation>(
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
            Dons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les dons reçus pour les projets et activités de la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadDonations}
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
            Enregistrer un don
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total reçu"
          value={totalReceived}
          prefix="€"
        />

        <StatCard title="Dons reçus" value={receivedCount} />
        <StatCard title="Dons en attente" value={pendingCount} />
        <StatCard title="Projets" value={availableProjects.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier le don"
              : "Enregistrer un nouveau don"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Nom du donateur"
              value={form.donor_name}
              onChange={(value) => updateForm("donor_name", value)}
              placeholder="Exemple : Famille Dupont"
              required
            />

            <FormField
              label="Montant"
              type="number"
              value={form.amount}
              onChange={(value) => updateForm("amount", value)}
              placeholder="Exemple : 100"
              required
            />

            <FormField
              label="Projet"
              value={form.project}
              onChange={(value) => updateForm("project", value)}
              placeholder="Exemple : Rénovation de la mosquée"
            />

            <FormField
              label="Mode de paiement"
              value={form.payment_method}
              onChange={(value) =>
                updateForm("payment_method", value)
              }
              placeholder="Exemple : Espèces, virement, chèque"
            />

            <FormField
              label="Date du don"
              type="date"
              value={form.donation_date}
              onChange={(value) => updateForm("donation_date", value)}
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
                placeholder="Précisions sur le don"
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
                  : "Enregistrer le don"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un donateur, un projet ou une note..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | DonationStatus
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

        <select
          value={projectFilter}
          onChange={(event) => setProjectFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les projets</option>

          {availableProjects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des dons</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredDonations.length} don(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun don trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Enregistrez un nouveau don ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Donateur</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Projet</th>
                  <th className="px-6 py-4">Paiement</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((donation) => {
                  const isUpdating = updatingId === donation.id;

                  return (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {donation.donor_name}
                        </div>

                        {donation.notes && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {donation.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        {donation.amount} €
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {donation.project || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {donation.payment_method || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {donation.donation_date || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[donation.status]}`}
                        >
                          {STATUS_LABELS[donation.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(donation)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          {donation.status !== "received" && (
                            <button
                              type="button"
                              onClick={() => markAsReceived(donation)}
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Traitement..."
                                : "Marquer reçu"}
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