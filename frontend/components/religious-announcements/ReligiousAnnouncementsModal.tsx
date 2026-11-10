
"use client";

import type { FormEvent } from "react";
import type {
  AnnouncementForm,
  AnnouncementFormField,
  AnnouncementType,
  AnnouncementPriority,
} from "./types";

import {
  TYPE_LABELS,
  TYPE_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: AnnouncementForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: AnnouncementFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ReligiousAnnouncementsModal({
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
    field: AnnouncementFormField,
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
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier l'annonce"
                : "Nouvelle annonce"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Créez et gérez les annonces liées aux prières,
              cours, rappels et activités religieuses.
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
        <form onSubmit={onSubmit} className="space-y-5 p-6">

          {/* Titre */}
          {renderInput(
            "Titre",
            "title",
            "text",
            true,
            "Exemple : Rappel : cours de Coran samedi"
          )}

          {/* Type et priorité */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d&apos;annonce
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={form.announcement_type}
                onChange={(event) =>
                  updateForm(
                    "announcement_type",
                    event.target.value
                  )
                }
                required
                className={inputClass}
              >
                {TYPE_OPTIONS.map((type: AnnouncementType) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priorité
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                required
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map(
                  (priority: AnnouncementPriority) => (
                    <option key={priority} value={priority}>
                      {PRIORITY_LABELS[priority]}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

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
              placeholder="Détails de l'annonce..."
              rows={5}
              className={inputClass}
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">

            {renderInput(
              "Date de début",
              "start_date",
              "date"
            )}

            {renderInput(
              "Date de fin",
              "end_date",
              "date"
            )}

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">

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
                  : "Créer l'annonce"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
