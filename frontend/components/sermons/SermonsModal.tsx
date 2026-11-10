
"use client";

import type { FormEvent } from "react";

import type {
  Imam,
  SermonForm,
  SermonFormField,
} from "./types";

import {
  TYPE_LABELS,
  TYPE_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  imams: Imam[];
  form: SermonForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: SermonFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function SermonsModal({
  open,
  imams,
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
    field: SermonFormField,
    type = "text",
    required = false,
    placeholder = ""
  ) {
    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
          {required && (
            <span className="text-red-500"> *</span>
          )}
        </label>

        <input
          type={type}
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
                ? "Modifier le sermon"
                : "Nouveau sermon"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les khutbas, sermons et enseignements de la communauté.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-2xl text-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="space-y-5 p-6">

          {/* Titre */}
          {renderInput(
            "Titre",
            "title",
            "text",
            true,
            "Exemple : Khutba sur la patience"
          )}

          {/* Type et imam */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>

              <select
                value={form.sermon_type}
                onChange={(event) =>
                  updateForm("sermon_type", event.target.value)
                }
                required
                className={inputClass}
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
                className={inputClass}
              >
                <option value="">Non attribué</option>

                {imams.map((imam) => (
                  <option key={imam.id} value={imam.id}>
                    {imam.first_name} {imam.last_name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Date */}
          {renderInput(
            "Date",
            "date",
            "date"
          )}

          {/* Vidéo */}
          {renderInput(
            "Lien vidéo",
            "video_url",
            "url",
            false,
            "https://..."
          )}

          {/* Audio */}
          {renderInput(
            "Lien audio",
            "audio_url",
            "url",
            false,
            "https://..."
          )}

          {/* Contenu */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Contenu
            </label>

            <textarea
              value={form.content}
              onChange={(event) =>
                updateForm("content", event.target.value)
              }
              placeholder="Résumé, points principaux ou texte du sermon..."
              rows={5}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
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
                  : "Créer le sermon"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}