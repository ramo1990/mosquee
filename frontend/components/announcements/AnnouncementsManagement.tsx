"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type AnnouncementType =
  | "general"
  | "prayer"
  | "event"
  | "course"
  | "urgent";

type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

type Announcement = {
  id: number;
  title: string;
  announcement_type: AnnouncementType;
  content?: string;
  priority: AnnouncementPriority;
  start_date?: string;
  end_date?: string;
  display_on_screens: boolean;
  is_published: boolean;
};

type AnnouncementForm = {
  title: string;
  announcement_type: AnnouncementType;
  content: string;
  priority: AnnouncementPriority;
  start_date: string;
  end_date: string;
  display_on_screens: boolean;
};

const EMPTY_FORM: AnnouncementForm = {
  title: "",
  announcement_type: "general",
  content: "",
  priority: "normal",
  start_date: "",
  end_date: "",
  display_on_screens: true,
};

const TYPE_LABELS: Record<AnnouncementType, string> = {
  general: "Générale",
  prayer: "Prière",
  event: "Événement",
  course: "Cours",
  urgent: "Urgente",
};

const TYPE_OPTIONS: AnnouncementType[] = [
  "general",
  "prayer",
  "event",
  "course",
  "urgent",
];

const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

const PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-700",
};

const PRIORITY_OPTIONS: AnnouncementPriority[] = [
  "low",
  "normal",
  "high",
  "urgent",
];

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | AnnouncementType
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | AnnouncementPriority
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Announcement[]>("/announcements/");

      setAnnouncements(data);
    } catch (err) {
      console.error("Erreur chargement des annonces :", err);
      setAnnouncements([]);
      setError(
        "Impossible de charger les annonces pour le moment."
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
        const data = await apiGetList<Announcement[]>(
          "/announcements/"
        );

        if (!ignore) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Erreur chargement des annonces :", err);

        if (!ignore) {
          setAnnouncements([]);
          setError(
            "Impossible de charger les annonces pour le moment."
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

  const filteredAnnouncements = useMemo(() => {
    const query = search.toLowerCase().trim();

    return announcements
      .filter((announcement) => {
        const matchesSearch =
          !query ||
          [
            announcement.title,
            announcement.content,
            announcement.start_date,
            announcement.end_date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" ||
          announcement.announcement_type === typeFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          announcement.priority === priorityFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && announcement.is_published) ||
          (statusFilter === "draft" && !announcement.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesPriority &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = a.start_date ?? "";
        const dateB = b.start_date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [
    announcements,
    search,
    typeFilter,
    priorityFilter,
    statusFilter,
  ]);

  const publishedCount = announcements.filter(
    (announcement) => announcement.is_published
  ).length;

  const draftCount = announcements.length - publishedCount;

  const screenCount = announcements.filter(
    (announcement) => announcement.display_on_screens
  ).length;

  function updateForm(
    field: keyof AnnouncementForm,
    value: string | boolean
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

  function openEditForm(announcement: Announcement) {
    setForm({
      title: announcement.title,
      announcement_type: announcement.announcement_type,
      content: announcement.content ?? "",
      priority: announcement.priority,
      start_date: announcement.start_date ?? "",
      end_date: announcement.end_date ?? "",
      display_on_screens: announcement.display_on_screens,
    });

    setEditingId(announcement.id);
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
      title: form.title.trim(),
      announcement_type: form.announcement_type,
      content: form.content.trim() || undefined,
      priority: form.priority,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      display_on_screens: form.display_on_screens,
    };

    try {
      if (editingId) {
        const updatedAnnouncement = await apiPatch<Announcement>(
          `/announcements/${editingId}/`,
          payload
        );

        setAnnouncements((current) =>
          current.map((announcement) =>
            announcement.id === editingId
              ? { ...announcement, ...updatedAnnouncement }
              : announcement
          )
        );

        setSuccess("Annonce modifiée avec succès.");
      } else {
        const createdAnnouncement = await apiPost<Announcement>(
          "/announcements/",
          payload
        );

        setAnnouncements((current) => [
          createdAnnouncement,
          ...current,
        ]);
        setSuccess("Annonce créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'annonce :", err);
      setError(
        editingId
          ? "Impossible de modifier cette annonce."
          : "Impossible de créer cette annonce."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(
    announcement: Announcement
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(announcement.id);

    const nextIsPublished = !announcement.is_published;

    try {
      await apiPatch(`/announcements/${announcement.id}/`, {
        is_published: nextIsPublished,
      });

      setAnnouncements((current) =>
        current.map((item) =>
          item.id === announcement.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Annonce publiée avec succès."
          : "Annonce retirée de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de cette annonce."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleScreenDisplay(
    announcement: Announcement
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(announcement.id);

    const nextDisplay = !announcement.display_on_screens;

    try {
      await apiPatch(`/announcements/${announcement.id}/`, {
        display_on_screens: nextDisplay,
      });

      setAnnouncements((current) =>
        current.map((item) =>
          item.id === announcement.id
            ? { ...item, display_on_screens: nextDisplay }
            : item
        )
      );

      setSuccess(
        nextDisplay
          ? "Annonce affichée sur les écrans."
          : "Annonce retirée des écrans."
      );
    } catch (err) {
      console.error(
        "Erreur modification de l'affichage :",
        err
      );
      setError(
        "Impossible de modifier l'affichage de cette annonce."
      );
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
            Annonces
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez et gérez les annonces destinées aux fidèles et aux écrans d’affichage.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadAnnouncements}
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
            Nouvelle annonce
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total annonces" value={announcements.length} />
        <StatCard title="Publiées" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard title="Affichées" value={screenCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'annonce"
              : "Créer une nouvelle annonce"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Rappel : cours de Coran samedi"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d'annonce
              </label>

              <select
                value={form.announcement_type}
                onChange={(event) =>
                  updateForm("announcement_type", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priorité
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Date de début"
              type="date"
              value={form.start_date}
              onChange={(value) => updateForm("start_date", value)}
            />

            <FormField
              label="Date de fin"
              type="date"
              value={form.end_date}
              onChange={(value) => updateForm("end_date", value)}
            />

            <div className="md:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Détails de l'annonce"
              />
            </div>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.display_on_screens}
                onChange={(event) =>
                  updateForm(
                    "display_on_screens",
                    event.target.checked
                  )
                }
                className="h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
              />

              <span className="text-sm font-semibold text-gray-700">
                Afficher sur les écrans d’affichage
              </span>
            </label>
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
                  : "Créer l'annonce"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_170px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une annonce..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value as "all" | AnnouncementType
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>

          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(
              event.target.value as "all" | AnnouncementPriority
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les priorités</option>

          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "published" | "draft"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiées</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des annonces
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredAnnouncements.length} annonce(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune annonce trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle annonce ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Annonce</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Période</th>
                  <th className="px-6 py-4">Écrans</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAnnouncements.map((announcement) => {
                  const isUpdating =
                    updatingId === announcement.id;

                  return (
                    <tr
                      key={announcement.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {announcement.title}
                        </div>

                        {announcement.content && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {announcement.content}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {TYPE_LABELS[announcement.announcement_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${PRIORITY_COLORS[announcement.priority]}`}
                        >
                          {PRIORITY_LABELS[announcement.priority]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {announcement.start_date || "—"}{" "}
                        {announcement.end_date
                          ? `→ ${announcement.end_date}`
                          : ""}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            announcement.display_on_screens
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {announcement.display_on_screens
                            ? "Affichée"
                            : "Non affichée"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            announcement.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {announcement.is_published
                            ? "Publiée"
                            : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(announcement)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              togglePublication(announcement)
                            }
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              announcement.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : announcement.is_published
                                ? "Dépublier"
                                : "Publier"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleScreenDisplay(announcement)
                            }
                            disabled={isUpdating}
                            className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                          >
                            {announcement.display_on_screens
                              ? "Retirer"
                              : "Afficher"}
                          </button>
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
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">{value}</p>
    </div>
  );
}