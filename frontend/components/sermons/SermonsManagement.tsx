"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type SermonType = "khutbah" | "sermon" | "lesson" | "conference";

type Sermon = {
  id: number;
  title: string;
  sermon_type: SermonType;
  content?: string;
  imam?: number | null;
  imam_name?: string;
  date?: string;
  video_url?: string;
  audio_url?: string;
  is_published: boolean;
};

type Imam = {
  id: number;
  first_name: string;
  last_name: string;
};

type SermonForm = {
  title: string;
  sermon_type: SermonType;
  content: string;
  imam: string;
  date: string;
  video_url: string;
  audio_url: string;
};

const EMPTY_FORM: SermonForm = {
  title: "",
  sermon_type: "khutbah",
  content: "",
  imam: "",
  date: "",
  video_url: "",
  audio_url: "",
};

const TYPE_LABELS: Record<SermonType, string> = {
  khutbah: "Khutba",
  sermon: "Sermon",
  lesson: "Enseignement",
  conference: "Conférence",
};

const TYPE_OPTIONS: SermonType[] = [
  "khutbah",
  "sermon",
  "lesson",
  "conference",
];

export default function SermonsManagement() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [imams, setImams] = useState<Imam[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | SermonType>("all");
  const [imamFilter, setImamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SermonForm>(EMPTY_FORM);

  const loadSermons = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [sermonsData, imamsData] = await Promise.all([
        apiGetList<Sermon[]>("/sermons/"),
        apiGetList<Imam[]>("/users/?role=imam"),
      ]);

      setSermons(sermonsData);
      setImams(imamsData);
    } catch (err) {
      console.error("Erreur chargement des sermons :", err);
      setSermons([]);
      setImams([]);
      setError("Impossible de charger les sermons pour le moment.");
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
        const [sermonsData, imamsData] = await Promise.all([
          apiGetList<Sermon[]>("/sermons/"),
          apiGetList<Imam[]>("/users/?role=imam"),
        ]);

        if (!ignore) {
          setSermons(sermonsData);
          setImams(imamsData);
        }
      } catch (err) {
        console.error("Erreur chargement des sermons :", err);

        if (!ignore) {
          setSermons([]);
          setImams([]);
          setError("Impossible de charger les sermons pour le moment.");
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

  const filteredSermons = useMemo(() => {
    const query = search.toLowerCase().trim();

    return sermons
      .filter((sermon) => {
        const matchesSearch =
          !query ||
          [
            sermon.title,
            sermon.content,
            sermon.imam_name,
            sermon.date,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" || sermon.sermon_type === typeFilter;

        const matchesImam =
          imamFilter === "all" || String(sermon.imam) === imamFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && sermon.is_published) ||
          (statusFilter === "draft" && !sermon.is_published);

        return (
          matchesSearch &&
          matchesType &&
          matchesImam &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = a.date ?? "";
        const dateB = b.date ?? "";

        return dateB.localeCompare(dateA);
      });
  }, [sermons, search, typeFilter, imamFilter, statusFilter]);

  const publishedCount = sermons.filter(
    (sermon) => sermon.is_published
  ).length;

  const draftCount = sermons.length - publishedCount;

  function updateForm(field: keyof SermonForm, value: string) {
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

  function openEditForm(sermon: Sermon) {
    setForm({
      title: sermon.title,
      sermon_type: sermon.sermon_type,
      content: sermon.content ?? "",
      imam: sermon.imam ? String(sermon.imam) : "",
      date: sermon.date ?? "",
      video_url: sermon.video_url ?? "",
      audio_url: sermon.audio_url ?? "",
    });

    setEditingId(sermon.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      sermon_type: form.sermon_type,
      content: form.content.trim() || undefined,
      imam: form.imam ? Number(form.imam) : null,
      date: form.date || undefined,
      video_url: form.video_url.trim() || undefined,
      audio_url: form.audio_url.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedSermon = await apiPatch<Sermon>(
          `/sermons/${editingId}/`,
          payload
        );

        setSermons((current) =>
          current.map((sermon) =>
            sermon.id === editingId
              ? { ...sermon, ...updatedSermon }
              : sermon
          )
        );

        setSuccess("Sermon modifié avec succès.");
      } else {
        const createdSermon = await apiPost<Sermon>("/sermons/", payload);

        setSermons((current) => [createdSermon, ...current]);
        setSuccess("Sermon créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement du sermon :", err);
      setError(
        editingId
          ? "Impossible de modifier ce sermon."
          : "Impossible de créer ce sermon."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(sermon: Sermon) {
    setError("");
    setSuccess("");
    setUpdatingId(sermon.id);

    const nextIsPublished = !sermon.is_published;

    try {
      await apiPatch(`/sermons/${sermon.id}/`, {
        is_published: nextIsPublished,
      });

      setSermons((current) =>
        current.map((item) =>
          item.id === sermon.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Sermon publié avec succès."
          : "Sermon retiré de la publication."
      );
    } catch (err) {
      console.error("Erreur modification de la publication :", err);
      setError("Impossible de modifier la publication de ce sermon.");
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
            Prêches et sermons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Publiez les khutbas, sermons et enseignements destinés à la communauté.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadSermons}
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
            Nouveau sermon
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total sermons" value={sermons.length} />
        <StatCard title="Publiés" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard title="Imams disponibles" value={imams.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier le sermon"
              : "Créer un nouveau sermon"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Khutba sur la patience"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type
              </label>

              <select
                value={form.sermon_type}
                onChange={(event) =>
                  updateForm("sermon_type", event.target.value)
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
                Imam
              </label>

              <select
                value={form.imam}
                onChange={(event) =>
                  updateForm("imam", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non attribué</option>

                {imams.map((imam) => (
                  <option key={imam.id} value={imam.id}>
                    {imam.first_name} {imam.last_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Date"
              type="date"
              value={form.date}
              onChange={(value) => updateForm("date", value)}
            />

            <FormField
              label="Lien vidéo"
              value={form.video_url}
              onChange={(value) => updateForm("video_url", value)}
              placeholder="https://..."
            />

            <FormField
              label="Lien audio"
              value={form.audio_url}
              onChange={(value) => updateForm("audio_url", value)}
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Résumé, points principaux ou texte du sermon"
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
                  : "Créer le sermon"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un sermon..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as "all" | SermonType)
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
          value={imamFilter}
          onChange={(event) => setImamFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les imams</option>

          {imams.map((imam) => (
            <option key={imam.id} value={imam.id}>
              {imam.first_name} {imam.last_name}
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
          <h3 className="font-bold text-gray-900">Liste des sermons</h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredSermons.length} sermon(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun sermon trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez un nouveau sermon ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Sermon</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Imam</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Médias</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSermons.map((sermon) => {
                  const isUpdating = updatingId === sermon.id;

                  return (
                    <tr key={sermon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {sermon.title}
                        </div>

                        {sermon.content && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {sermon.content}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {TYPE_LABELS[sermon.sermon_type]}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {sermon.imam_name || "Non attribué"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {sermon.date || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {sermon.video_url || sermon.audio_url ? "Disponible" : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            sermon.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sermon.is_published ? "Publié" : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(sermon)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(sermon)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              sermon.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : sermon.is_published
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