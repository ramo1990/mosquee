
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGetList,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/lib/api";

type MemberStatus = "active" | "inactive" | "pending";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  member_number?: string;
  address?: string;
  status?: MemberStatus;
};

type MemberForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  member_number: string;
  address: string;
  status: MemberStatus;
};

const EMPTY_FORM: MemberForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  member_number: "",
  address: "",
  status: "active",
};

const STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};

export default function MembersManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm>(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Member>("/members/");
      setMembers(data);
    } catch (err) {
      console.error("Erreur chargement des fidèles :", err);
      setMembers([]);
      setError("Impossible de charger les fidèles pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        [
          member.first_name,
          member.last_name,
          member.email,
          member.phone,
          member.member_number,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (member.status || "active") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const activeCount = members.filter(
    (m) => m.status === "active"
  ).length;

  const inactiveCount = members.filter(
    (m) => m.status === "inactive"
  ).length;

  const pendingCount = members.filter(
    (m) => m.status === "pending"
  ).length;

  function openCreateModal() {
    setSelectedMember(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(member: Member) {
    setSelectedMember(member);

    setForm({
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      email: member.email || "",
      phone: member.phone || "",
      member_number: member.member_number || "",
      address: member.address || "",
      status: member.status || "active",
    });

    setError("");
    setModalOpen(true);
  }

  function updateField<K extends keyof MemberForm>(
    field: K,
    value: MemberForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
        if (selectedMember) {
        await apiPatch(`/members/${selectedMember.id}/`, form);
        setSuccess("Fidèle modifié avec succès.");
        } else {
        await apiPost("/members/", form);
        setSuccess("Fidèle ajouté avec succès.");
        }

        setModalOpen(false);
        setForm(EMPTY_FORM);
        setSelectedMember(null);

        await loadMembers();
    } catch (err) {
        console.error("Erreur enregistrement fidèle :", err);
        setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
        setSaving(false);
    }
    }

    async function handleDelete(member: Member) {
        const confirmed = window.confirm(
            `Supprimer ${member.first_name} ${member.last_name} ?`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await apiDelete(`/members/${member.id}/`);

            setSuccess("Fidèle supprimé avec succès.");

            await loadMembers();
        } catch (err) {
            console.error("Erreur suppression fidèle :", err);
            setError("Impossible de supprimer ce fidèle pour le moment.");
        }
    }

  return (
    <div className="space-y-6">

      {/* Notifications */}
      {error && (
        <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
            <p className="font-semibold">Information</p>
            <p className="mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Répertoire des fidèles
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les membres de votre mosquée.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
        >
          + Ajouter un fidèle
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total des fidèles" value={members.length} />
        <StatCard title="Membres actifs" value={activeCount} />
        <StatCard title="Membres inactifs" value={inactiveCount} />
        <StatCard title="En attente" value={pendingCount} />
      </div>

      {/* Filtres */}
      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un fidèle..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="pending">En attente</option>
        </select>

        <button
          type="button"
          onClick={loadMembers}
          disabled={loading}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
        >
          Actualiser
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des fidèles
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {filteredMembers.length} membre(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement des fidèles...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun fidèle trouvé
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Ajoutez un fidèle ou modifiez votre recherche.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Fidèle</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Numéro</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {member.first_name} {member.last_name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {member.email || "Aucun e-mail"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {member.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {member.member_number || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={member.status || "active"} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(member)}
                          className="font-semibold text-emerald-700 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          className="font-semibold text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire */}
      {modalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-extrabold text-gray-900">
                {selectedMember ? "Modifier le fidèle" : "Ajouter un fidèle"}
              </h2>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Prénom"
                  value={form.first_name}
                  onChange={(v) => updateField("first_name", v)}
                  required
                />

                <FormField
                  label="Nom"
                  value={form.last_name}
                  onChange={(v) => updateField("last_name", v)}
                  required
                />

                <FormField
                  label="Téléphone"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                />

                <FormField
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                />

                <FormField
                  label="Numéro de membre"
                  value={form.member_number}
                  onChange={(v) => updateField("member_number", v)}
                />

                <FormField
                  label="Adresse"
                  value={form.address}
                  onChange={(v) => updateField("address", v)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Statut
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as MemberStatus)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : selectedMember
                      ? "Enregistrer"
                      : "Ajouter le fidèle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-extrabold text-gray-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const styles: Record<MemberStatus, string> = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-gray-100 text-gray-700",
    pending: "bg-amber-100 text-amber-800",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}
