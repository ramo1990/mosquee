
"use client";

import type { MediaForm, MediaType } from "./types";

type Props = {
  open: boolean;
  form: MediaForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: keyof MediaForm,
    value: string | File | null
  ) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MediaModal({
  open,
  form,
  editingId,
  saving,
  updateForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  function renderInput(
    label: string,
    field: "title" | "file_url" | "category",
    placeholder = "",
    required = false
  ) {
    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>

        <input
          type="text"
          value={form[field]}
          onChange={(event) =>
            updateForm(field, event.target.value)
          }
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier le média"
                : "Ajouter un nouveau média"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les images et vidéos utilisées dans vos affichages.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fermer"
            className="text-2xl text-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={onSubmit}
          className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">

            <div className="md:col-span-2">
              {renderInput(
                "Titre",
                "title",
                "Exemple : Photo de la mosquée",
                true
              )}
            </div>

            {/* Type */}
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
                className={inputClass}
              >
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
              </select>
            </div>

            {/* Catégorie */}
            {renderInput(
              "Catégorie",
              "category",
              "Exemple : Mosquée, événement, formation"
            )}

            {/* URL */}
            <div className="md:col-span-2">
              {renderInput(
                "Lien du média",
                "file_url",
                "https://..."
              )}
            </div>

            {/* Fichier */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Ou importer un fichier
              </label>

              <input
                type="file"
                accept={
                  form.media_type === "image"
                    ? "image/*"
                    : "video/*"
                }
                onChange={(event) =>
                  updateForm(
                    "file",
                    event.target.files?.[0] ?? null
                  )
                }
                className={inputClass}
              />

              {form.file && (
                <p className="mt-2 text-xs text-gray-500">
                  Fichier sélectionné : {form.file.name}
                </p>
              )}

              {editingId !== null && !form.file && (
                <p className="mt-2 text-xs text-gray-500">
                  Laissez vide pour conserver le fichier actuel.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Description du média..."
                rows={4}
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
                : editingId !== null
                  ? "Enregistrer les modifications"
                  : "Ajouter le média"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}