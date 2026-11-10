import { useCallback, useEffect, useMemo, useState } from "react";

import {
  apiGetList,
  apiPost,
  apiPatch,
  apiDelete,
  apiGetCurrentUser,
} from "@/lib/api";

import type { User } from "@/lib/types";

import type {
  Member,
  MemberForm,
  MemberStatus,
  Mosque,
} from "./members.types";

import { EMPTY_FORM } from "./members.constants";

export function useMembers() {
  const [user, setUser] = useState<User | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);

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

  // Charger les membres
  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Member>("/members/");
      setMembers(data);
    } catch (err) {
      console.error("Erreur chargement des fidèles :", err);

      setMembers([]);

      setError(
        "Impossible de charger les fidèles pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger l'utilisateur et les mosquées
  useEffect(() => {
    async function loadUserAndMosques() {
      try {
        const currentUser = await apiGetCurrentUser();

        setUser(currentUser);

        if (currentUser.role === "super_admin") {
          const data = await apiGetList<Mosque>("/mosquees/");
          setMosques(data);
        }
      } catch (err) {
        console.error("Erreur utilisateur ou mosquées :", err);
      }
    }

    loadUserAndMosques();
  }, []);

  // Chargement initial des membres
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Filtrage
  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        [
          member.first_name,
          member.last_name,
          member.email,
          member.phone,
          member.member_number,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (member.status || "active") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  // Statistiques
  const activeCount = members.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveCount = members.filter(
    (member) => member.status === "inactive"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "pending"
  ).length;

  // Ouvrir le formulaire de création
  function openCreateModal() {
    setSelectedMember(null);
    setForm({ ...EMPTY_FORM });

    setError("");
    setModalOpen(true);
  }

  // Ouvrir le formulaire de modification
  function openEditModal(member: Member) {
    setSelectedMember(member);

    setForm({
      mosque: member.mosque?.toString() || "",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      status: member.status || "active",
    });

    setError("");
    setModalOpen(true);
  }

  // Modifier un champ du formulaire
  function updateField<K extends keyof MemberForm>(
    field: K,
    value: MemberForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Fermer le formulaire
  function closeModal() {
    setModalOpen(false);
    setSelectedMember(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  }

  // Ajouter ou modifier un fidèle
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      ...(user?.role !== "super_admin" && {
        mosque: undefined,
      }),
    };

    try {
      if (selectedMember) {
        await apiPatch(
          `/members/${selectedMember.id}/`,
          payload
        );

        setSuccess("Fidèle modifié avec succès.");
      } else {
        await apiPost("/members/", payload);

        setSuccess("Fidèle ajouté avec succès.");
      }

      closeModal();

      await loadMembers();
    } catch (err) {
      console.error("Erreur enregistrement du fidèle :", err);

      if (err instanceof Error) {
        console.error("Message :", err.message);
      }

      setError(
        "Impossible d'enregistrer le fidèle. Vérifiez les informations saisies."
      );
    } finally {
      setSaving(false);
    }
  }

  // Supprimer un fidèle
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

      setError(
        "Impossible de supprimer ce fidèle pour le moment."
      );
    }
  }

  return {
    user,
    mosques,
    members,

    loading,
    saving,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    modalOpen,
    setModalOpen,
    selectedMember,
    form,

    error,
    success,

    filteredMembers,

    activeCount,
    inactiveCount,
    pendingCount,

    loadMembers,
    openCreateModal,
    openEditModal,
    updateField,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}