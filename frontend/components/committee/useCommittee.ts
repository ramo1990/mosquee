import { useCallback, useEffect, useMemo, useState } from "react";

import {
  apiGetList,
  apiPatch,
  apiPost,
} from "@/lib/api";

import type {
  CommitteeMember,
  CommitteeFormData,
} from "./committee.types";

import { INITIAL_COMMITTEE_FORM } from "./committee.constants";

export function useCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [committeeRole, setCommitteeRole] = useState("member");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CommitteeFormData>(
    INITIAL_COMMITTEE_FORM
  );

  const selectedMember = useMemo(
    () =>
      members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return members;

    return members.filter((member) =>
      [
        member.first_name,
        member.last_name,
        member.username,
        member.email,
        member.phone,
      ].some((value) =>
        value?.toLowerCase().includes(query)
      )
    );
  }, [members, search]);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<CommitteeMember>(
        "/users/?role=committee"
      );

      setMembers(data);
    } catch (err) {
      console.error("Erreur chargement comité :", err);

      setMembers([]);

      setError(
        "Impossible de charger les membres du comité pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  function updateForm(
    field: keyof CommitteeFormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createCommitteeMember(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const createdMember = await apiPost<CommitteeMember>(
        "/users/",
        {
          username: form.username.trim(),
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          password_confirm: form.password_confirm,
          committee_role: form.committee_role,
          role: "committee",
        }
      );

      setMembers((current) => [createdMember, ...current]);

      setSuccess("Membre du comité créé avec succès.");

      setForm({ ...INITIAL_COMMITTEE_FORM });

      setShowCreateForm(false);
    } catch (err) {
      console.error("Erreur création du membre :", err);

      setError("Impossible de créer ce membre du comité.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(member: CommitteeMember) {
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
          ? "Membre du comité activé."
          : "Membre du comité désactivé."
      );
    } catch (err) {
      console.error("Erreur modification :", err);

      setError("Impossible de modifier le statut de ce membre.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateCommitteeRole() {
    if (!selectedMemberId) return;

    setError("");
    setSuccess("");

    setSavingRoleId(selectedMemberId);

    try {
      const updatedMember = await apiPatch<CommitteeMember>(
        `/users/${selectedMemberId}/`,
        {
          committee_role: committeeRole,
        }
      );

      setMembers((current) =>
        current.map((member) =>
          member.id === selectedMemberId
            ? { ...member, ...updatedMember }
            : member
        )
      );

      setSuccess("Fonction du membre mise à jour.");
    } catch (err) {
      console.error("Erreur modification de la fonction :", err);

      setError("Impossible de modifier la fonction de ce membre.");
    } finally {
      setSavingRoleId(null);
    }
  }

  function selectMember(member: CommitteeMember) {
    setSelectedMemberId(member.id);
    setCommitteeRole(member.committee_role ?? "member");
  }

  return {
    members,
    loading,
    search,
    setSearch,

    error,
    success,

    updatingId,
    savingRoleId,

    selectedMemberId,
    selectedMember,
    committeeRole,
    setCommitteeRole,

    showCreateForm,
    setShowCreateForm,

    saving,
    form,
    updateForm,

    filteredMembers,

    loadMembers,
    createCommitteeMember,
    toggleStatus,
    updateCommitteeRole,
    selectMember,
  };
}