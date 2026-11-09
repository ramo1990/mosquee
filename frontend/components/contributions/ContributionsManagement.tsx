"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type ContributionStatus = "pending" | "paid" | "partial" | "cancelled";

type Contribution = {
  id: number;
  member?: number | null;
  member_name?: string;
  amount: number;
  amount_paid?: number;
  due_date?: string;
  paid_date?: string;
  status: ContributionStatus;
  notes?: string;
  is_active: boolean;
};

type Member = {
  id: number;
  first_name: string;
  last_name: string;
};

type ContributionForm = {
  member: string;
  amount: string;
  amount_paid: string;
  due_date: string;
  paid_date: string;
  status: ContributionStatus;
  notes: string;
};

const EMPTY_FORM: ContributionForm = {
  member: "",
  amount: "",
  amount_paid: "",
  due_date: "",
  paid_date: "",
  status: "pending",
  notes: "",
};

const STATUS_LABELS: Record<ContributionStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  partial: "Partielle",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<ContributionStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: ContributionStatus[] = [
  "pending",
  "paid",
  "partial",
  "cancelled",
];

export default function ContributionsManagement() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ContributionStatus
  >("all");
  const [memberFilter, setMemberFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContributionForm>(EMPTY_FORM);

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
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [contributionsData, membersData] = await Promise.all([
          apiGetList<Contribution[]>("/contributions/"),
          apiGetList<Member[]>("/users/"),
        ]);

        if (!ignore) {
          setContributions(contributionsData);
          setMembers(membersData);
        }
      } catch (err) {
        console.error("Erreur chargement des cotisations :", err);

        if (!ignore) {
          setContributions([]);
          setMembers([]);
          setError(
            "Impossible de charger les cotisations pour le moment."
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
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "all" ||
          contribution.status === statusFilter;

        const matchesMember =
          memberFilter === "all" ||
          String(contribution.member) === memberFilter;

        return matchesSearch && matchesStatus && matchesMember;
      })
      .sort((a, b) => {
        const dateA = a.due_date ?? "";
        const dateB = b.due_date ?? "";

        return dateA.localeCompare(dateB);
      });
  }, [contributions, search, statusFilter, memberFilter]);

  const totalExpected = contributions.reduce(
    (total, contribution) => total + (contribution.amount ?? 0),
    0
  );

  const totalPaid = contributions.reduce(
    (total, contribution) => total + (contribution.amount_paid ?? 0),
    0
  );

  const pendingCount = contributions.filter(
    (contribution) => contribution.status === "pending"
  ).length;

  const paidCount = contributions.filter(
    (contribution) => contribution.status === "paid"
  ).length;

  function updateForm(field: keyof ContributionForm, value: string) {
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
      if (editingId) {
        const updatedContribution = await apiPatch<Contribution>(
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
        const createdContribution = await apiPost<Contribution>(
          "/contributions/",
          payload
        );

        setContributions((current) => [
          createdContribution,
          ...current,
        ]);
        setSuccess("Cotisation créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la cotisation :", err);
      setError(
        editingId
          ? "Impossible de modifier cette cotisation."
          : "Impossible de créer cette cotisation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function markAsPaid(contribution: Contribution) {
    setError("");
    setSuccess("");
    setUpdatingId(contribution.id);

    try {
      const updatedContribution = await apiPatch<Contribution>(
        `/contributions/${contribution.id}/`,
        {
          status: "paid",
          amount_paid: contribution.amount,
          paid_date: new Date().toISOString().slice(0, 10),
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
      console.error("Erreur paiement de la cotisation :", err);
      setError("Impossible de marquer cette cotisation comme payée.");
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
            Cotisations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Suivez les cotisations des fidèles, les échéances et l’historique des paiements.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadContributions}
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
            Nouvelle cotisation
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total attendu"
          value={totalExpected}
          prefix="€"
        />

        <StatCard
          title="Total encaissé"
          value={totalPaid}
          prefix="€"
        />

        <StatCard title="En attente" value={pendingCount} />
        <StatCard title="Payées" value={paidCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier la cotisation"
              : "Créer une nouvelle cotisation"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Fidèle <span className="text-red-500">*</span>
              </label>

              <select
                value={form.member}
                onChange={(event) =>
                  updateForm("member", event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Sélectionner un fidèle</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Montant attendu"
              type="number"
              value={form.amount}
              onChange={(value) => updateForm("amount", value)}
              placeholder="Exemple : 50"
              required
            />

            <FormField
              label="Montant payé"
              type="number"
              value={form.amount_paid}
              onChange={(value) => updateForm("amount_paid", value)}
              placeholder="Exemple : 25"
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

            <FormField
              label="Échéance"
              type="date"
              value={form.due_date}
              onChange={(value) => updateForm("due_date", value)}
            />

            <FormField
              label="Date de paiement"
              type="date"
              value={form.paid_date}
              onChange={(value) => updateForm("paid_date", value)}
            />

            <div className="md:col-span-2">
              <FormField
                label="Notes"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Précisions sur la cotisation"
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
                  : "Créer la cotisation"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un fidèle, une note ou une date..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | ContributionStatus
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
          value={memberFilter}
          onChange={(event) => setMemberFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les fidèles</option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.first_name} {member.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des cotisations
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredContributions.length} cotisation(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune cotisation trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle cotisation ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Fidèle</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Payé</th>
                  <th className="px-6 py-4">Échéance</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredContributions.map((contribution) => {
                  const isUpdating =
                    updatingId === contribution.id;

                  return (
                    <tr
                      key={contribution.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {contribution.member_name ||
                            `Fidèle #${contribution.member}`}
                        </div>

                        {contribution.notes && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {contribution.notes}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {contribution.amount} €
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {contribution.amount_paid ?? 0} €
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {contribution.due_date || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[contribution.status]}`}
                        >
                          {STATUS_LABELS[contribution.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(contribution)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          {contribution.status !== "paid" && (
                            <button
                              type="button"
                              onClick={() => markAsPaid(contribution)}
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Traitement..."
                                : "Marquer payée"}
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