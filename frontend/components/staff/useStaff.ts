
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  apiGetList,
  apiPost,
  apiPatch,
} from "@/lib/api";

import type {
  StaffMember,
  StaffForm,
  StaffRole,
  StaffFormField,
} from "./staff.types";

import { EMPTY_STAFF_FORM } from "./staff.constants";

export function useStaff() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<StaffForm>(EMPTY_STAFF_FORM);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Chargement des imams et enseignants
  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [imams, teachers] = await Promise.all([
        apiGetList<StaffMember>("/users/?role=imam"),
        apiGetList<StaffMember>("/users/?role=teacher"),
      ]);

      setMembers([...imams, ...teachers]);
    } catch (err) {
      console.error("Erreur chargement du personnel :", err);

      setMembers([]);

      setError(
        "Impossible de charger les imams et enseignants pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Recherche et filtrage
  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        [
          member.first_name,
          member.last_name,
          member.username,
          member.email,
          member.phone,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  // Statistiques
  const imamCount = members.filter(
    (member) => member.role === "imam"
  ).length;

  const teacherCount = members.filter(
    (member) => member.role === "teacher"
  ).length;

  const activeCount = members.filter(
    (member) => member.is_active
  ).length;

  // Ouverture de la modale
  function openCreateModal() {
    setForm(EMPTY_STAFF_FORM);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setForm(EMPTY_STAFF_FORM);
  }

  // Modification du formulaire
  function updateForm(
    field: StaffFormField,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Création d'un imam ou enseignant
  async function createStaffMember(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.password_confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);

    try {
      const createdMember = await apiPost<StaffMember>(
        "/users/",
        {
          username: form.username.trim(),
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          password_confirm: form.password_confirm,
          role: form.role,
        }
      );

      setMembers((current) => [
        createdMember,
        ...current,
      ]);

      setSuccess(
        form.role === "imam"
          ? "Imam ajouté avec succès."
          : "Enseignant ajouté avec succès."
      );

      setModalOpen(false);
      setForm(EMPTY_STAFF_FORM);
    } catch (err) {
      console.error("Erreur création du personnel :", err);

      setError(
        "Impossible de créer ce compte. Vérifiez les informations saisies."
      );
    } finally {
      setSaving(false);
    }
  }

  // Activation / désactivation
  async function toggleStatus(member: StaffMember) {
    setError("");
    setSuccess("");
    setUpdatingId(member.id);

    const nextIsActive = !member.is_active;

    try {
      await apiPatch(`/users/${member.id}/`, {
        is_active: nextIsActive,
      });

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Compte activé avec succès."
          : "Compte désactivé avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du compte :", err);

      setError(
        "Impossible de modifier le statut de ce compte."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    members,
    filteredMembers,

    loading,
    saving,
    updatingId,

    search,
    setSearch,

    roleFilter,
    setRoleFilter,

    error,
    success,

    modalOpen,
    form,

    imamCount,
    teacherCount,
    activeCount,

    loadMembers,
    openCreateModal,
    closeModal,
    updateForm,
    createStaffMember,
    toggleStatus,
  };
}
