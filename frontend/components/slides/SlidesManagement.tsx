"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type Slide = {
  id: number;
  title: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  screen_group?: string;
  display_order: number;
  duration_seconds: number;
  is_published: boolean;
};

type SlideForm = {
  title: string;
  content: string;
  image_url: string;
  video_url: string;
  screen_group: string;
  display_order: string;
  duration_seconds: string;
};

const EMPTY_FORM: SlideForm = {
  title: "",
  content: "",
  image_url: "",
  video_url: "",
  screen_group: "",
  display_order: "1",
  duration_seconds: "10",
};

export default function SlidesManagement() {
  const [slides, setSlides] = useState<Slide[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SlideForm>(EMPTY_FORM);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Slide[]>("/slides/");

      setSlides(data);
    } catch (err) {
      console.error("Erreur chargement des diapositives :", err);
      setSlides([]);
      setError(
        "Impossible de charger les diapositives pour le moment."
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
        const data = await apiGetList<Slide[]>("/slides/");

        if (!ignore) {
          setSlides(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des diapositives :",
          err
        );

        if (!ignore) {
          setSlides([]);
          setError(
            "Impossible de charger les diapositives pour le moment."
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

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    slides.forEach((slide) => {
      if (slide.screen_group) {
        groups.add(slide.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [slides]);

  const filteredSlides = useMemo(() => {
    const query = search.toLowerCase().trim();

    return slides
      .filter((slide) => {
        const matchesSearch =
          !query ||
          [
            slide.title,
            slide.content,
            slide.screen_group,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesGroup =
          groupFilter === "all" ||
          slide.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && slide.is_published) ||
          (statusFilter === "draft" && !slide.is_published);

        return matchesSearch && matchesGroup && matchesStatus;
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [slides, search, groupFilter, statusFilter]);

  const publishedCount = slides.filter(
    (slide) => slide.is_published
  ).length;

  const draftCount = slides.length - publishedCount;

  function updateForm(field: keyof SlideForm, value: string) {
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

  function openEditForm(slide: Slide) {
    setForm({
      title: slide.title,
      content: slide.content ?? "",
      image_url: slide.image_url ?? "",
      video_url: slide.video_url ?? "",
      screen_group: slide.screen_group ?? "",
      display_order: String(slide.display_order),
      duration_seconds: String(slide.duration_seconds),
    });

    setEditingId(slide.id);
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
      content: form.content.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      video_url: form.video_url.trim() || undefined,
      screen_group: form.screen_group.trim() || undefined,
      display_order: Number(form.display_order),
      duration_seconds: Number(form.duration_seconds),
    };

    try {
      if (editingId) {
        const updatedSlide = await apiPatch<Slide>(
          `/slides/${editingId}/`,
          payload
        );

        setSlides((current) =>
          current.map((slide) =>
            slide.id === editingId
              ? { ...slide, ...updatedSlide }
              : slide
          )
        );

        setSuccess("Diapositive modifiée avec succès.");
      } else {
        const createdSlide = await apiPost<Slide>("/slides/", payload);

        setSlides((current) => [...current, createdSlide]);
        setSuccess("Diapositive créée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Erreur enregistrement de la diapositive :",
        err
      );
      setError(
        editingId
          ? "Impossible de modifier cette diapositive."
          : "Impossible de créer cette diapositive."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(slide: Slide) {
    setError("");
    setSuccess("");
    setUpdatingId(slide.id);

    const nextIsPublished = !slide.is_published;

    try {
      await apiPatch(`/slides/${slide.id}/`, {
        is_published: nextIsPublished,
      });

      setSlides((current) =>
        current.map((item) =>
          item.id === slide.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Diapositive publiée avec succès."
          : "Diapositive retirée de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de cette diapositive."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function moveSlide(slide: Slide, direction: -1 | 1) {
    setError("");
    setSuccess("");
    setUpdatingId(slide.id);

    const nextOrder = slide.display_order + direction;

    try {
      const updatedSlide = await apiPatch<Slide>(
        `/slides/${slide.id}/`,
        {
          display_order: nextOrder,
        }
      );

      setSlides((current) =>
        current.map((item) =>
          item.id === slide.id
            ? { ...item, ...updatedSlide }
            : item
        )
      );

      setSuccess("Ordre d’affichage modifié.");
    } catch (err) {
      console.error(
        "Erreur modification de l'ordre :",
        err
      );
      setError(
        "Impossible de modifier l'ordre de cette diapositive."
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
            Gestion des diapositives
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Créez et organisez les diapositives affichées sur les écrans.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadSlides}
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
            Nouvelle diapositive
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total diapositives" value={slides.length} />
        <StatCard title="Publiées" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard
          title="Groupes d’écrans"
          value={availableGroups.length}
        />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier la diapositive"
              : "Créer une nouvelle diapositive"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Bienvenue à la mosquée"
                required
              />
            </div>

            <FormField
              label="Groupe d’écrans"
              value={form.screen_group}
              onChange={(value) =>
                updateForm("screen_group", value)
              }
              placeholder="Exemple : Accueil, Salle de prière"
            />

            <FormField
              label="Ordre d’affichage"
              type="number"
              value={form.display_order}
              onChange={(value) =>
                updateForm("display_order", value)
              }
              placeholder="Exemple : 1"
              required
            />

            <FormField
              label="Durée en secondes"
              type="number"
              value={form.duration_seconds}
              onChange={(value) =>
                updateForm("duration_seconds", value)
              }
              placeholder="Exemple : 10"
              required
            />

            <FormField
              label="Lien de l’image"
              value={form.image_url}
              onChange={(value) => updateForm("image_url", value)}
              placeholder="https://..."
            />

            <FormField
              label="Lien de la vidéo"
              value={form.video_url}
              onChange={(value) => updateForm("video_url", value)}
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Texte affiché sur la diapositive"
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
                  : "Créer la diapositive"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une diapositive..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={groupFilter}
          onChange={(event) => setGroupFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les groupes</option>

          {availableGroups.map((group) => (
            <option key={group} value={group}>
              {group}
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
            Liste des diapositives
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredSlides.length} diapositive(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune diapositive trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Créez une nouvelle diapositive ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Ordre</th>
                  <th className="px-6 py-4">Diapositive</th>
                  <th className="px-6 py-4">Groupe</th>
                  <th className="px-6 py-4">Durée</th>
                  <th className="px-6 py-4">Média</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSlides.map((slide) => {
                  const isUpdating = updatingId === slide.id;

                  return (
                    <tr
                      key={slide.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {slide.display_order}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {slide.title}
                        </div>

                        {slide.content && (
                          <div className="mt-1 max-w-md text-xs text-gray-500">
                            {slide.content}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {slide.screen_group || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {slide.duration_seconds} s
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {slide.image_url || slide.video_url
                          ? "Disponible"
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            slide.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {slide.is_published
                            ? "Publiée"
                            : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => moveSlide(slide, -1)}
                            disabled={isUpdating}
                            className="font-semibold text-gray-700 hover:underline disabled:opacity-50"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() => moveSlide(slide, 1)}
                            disabled={isUpdating}
                            className="font-semibold text-gray-700 hover:underline disabled:opacity-50"
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(slide)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(slide)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              slide.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : slide.is_published
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