"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type MediaType = "image" | "video";

type MediaItem = {
  id: number;
  title: string;
  media_type: MediaType;
  file_url?: string;
  file?: File | null;
  category?: string;
  description?: string;
  is_published: boolean;
};

type MediaForm = {
  title: string;
  media_type: MediaType;
  file_url: string;
  file: File | null;
  category: string;
  description: string;
};

const EMPTY_FORM: MediaForm = {
  title: "",
  media_type: "image",
  file_url: "",
  file: null,
  category: "",
  description: "",
};

const TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  video: "Vidéo",
};

export default function MediaManagement() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MediaForm>(EMPTY_FORM);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<MediaItem[]>("/media/");

      setMediaItems(data);
    } catch (err) {
      console.error("Erreur chargement des médias :", err);
      setMediaItems([]);
      setError("Impossible de charger les médias pour le moment.");
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
        const data = await apiGetList<MediaItem[]>("/media/");

        if (!ignore) {
          setMediaItems(data);
        }
      } catch (err) {
        console.error("Erreur chargement des médias :", err);

        if (!ignore) {
          setMediaItems([]);
          setError(
            "Impossible de charger les médias pour le moment."
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

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    mediaItems.forEach((media) => {
      if (media.category) {
        categories.add(media.category);
      }
    });

    return Array.from(categories).sort();
  }, [mediaItems]);

  const filteredMedia = useMemo(() => {
    const query = search.toLowerCase().trim();

    return mediaItems
      .filter((media) => {
        const matchesSearch =
          !query ||
          [
            media.title,
            media.category,
            media.description,
            media.file_url,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" || media.media_type === typeFilter;

        const matchesCategory =
          categoryFilter === "all" || media.category === categoryFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && media.is_published) ||
          (statusFilter === "draft" && !media.is_published);

        return matchesSearch && matchesType && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [mediaItems, search, typeFilter, categoryFilter, statusFilter]);

  const imageCount = mediaItems.filter(
    (media) => media.media_type === "image"
  ).length;

  const videoCount = mediaItems.filter(
    (media) => media.media_type === "video"
  ).length;

  const publishedCount = mediaItems.filter(
    (media) => media.is_published
  ).length;

  function updateForm(
    field: keyof MediaForm,
    value: string | File | null
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

  function openEditForm(media: MediaItem) {
    setForm({
      title: media.title,
      media_type: media.media_type,
      file_url: media.file_url ?? "",
      file: null,
      category: media.category ?? "",
      description: media.description ?? "",
    });

    setEditingId(media.id);
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

    try {
      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("media_type", form.media_type);

      if (form.file) {
        payload.append("file", form.file);
      } else if (form.file_url.trim()) {
        payload.append("file_url", form.file_url.trim());
      }

      if (form.category.trim()) {
        payload.append("category", form.category.trim());
      }

      if (form.description.trim()) {
        payload.append("description", form.description.trim());
      }

      if (editingId) {
        const updatedMedia = await apiPatch<MediaItem>(
          `/media/${editingId}/`,
          payload
        );

        setMediaItems((current) =>
          current.map((media) =>
            media.id === editingId
              ? { ...media, ...updatedMedia }
              : media
          )
        );

        setSuccess("Média modifié avec succès.");
      } else {
        const createdMedia = await apiPost<MediaItem>(
          "/media/",
          payload
        );

        setMediaItems((current) => [createdMedia, ...current]);
        setSuccess("Média ajouté avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du média :", err);
      setError(
        editingId
          ? "Impossible de modifier ce média."
          : "Impossible d'ajouter ce média."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(media: MediaItem) {
    setError("");
    setSuccess("");
    setUpdatingId(media.id);

    const nextIsPublished = !media.is_published;

    try {
      await apiPatch(`/media/${media.id}/`, {
        is_published: nextIsPublished,
      });

      setMediaItems((current) =>
        current.map((item) =>
          item.id === media.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Média publié avec succès."
          : "Média retiré de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de ce média."
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
            Images et vidéos
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ajoutez et organisez les médias utilisés dans les affichages.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadMedia}
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
            Ajouter un média
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total médias" value={mediaItems.length} />
        <StatCard title="Images" value={imageCount} />
        <StatCard title="Vidéos" value={videoCount} />
        <StatCard title="Publiés" value={publishedCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier le média"
              : "Ajouter un nouveau média"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Photo de la mosquée"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type de média
              </label>

              <select
                value={form.media_type}
                onChange={(event) =>
                  updateForm(
                    "media_type",
                    event.target.value as MediaType
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
              </select>
            </div>

            <FormField
              label="Catégorie"
              value={form.category}
              onChange={(value) => updateForm("category", value)}
              placeholder="Exemple : Mosquée, événement, formation"
            />

            <FormField
              label="Lien du média"
              value={form.file_url}
              onChange={(value) => updateForm("file_url", value)}
              placeholder="https://..."
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Ou importer un fichier
              </label>

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(event) =>
                  updateForm("file", event.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Description du média"
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
                  : "Ajouter le média"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_160px_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un média..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as "all" | MediaType)
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Toutes les catégories</option>

          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
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
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">Liste des médias</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredMedia.length} média(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun média trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Ajoutez un nouveau média ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Média</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Fichier</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMedia.map((media) => {
                  const isUpdating = updatingId === media.id;

                  return (
                    <tr
                      key={media.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {media.title}
                        </div>

                        {media.description && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {media.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {TYPE_LABELS[media.media_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {media.category || "—"}
                      </td>

                      <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                        {media.file_url || "Fichier importé"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            media.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {media.is_published ? "Publié" : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(media)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(media)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              media.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : media.is_published
                                ? "Dépublier"
                                : "Publier"}
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