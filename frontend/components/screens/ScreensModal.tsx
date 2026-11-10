
"use client";

import type { FormEvent } from "react";

import type {
  ScreenForm,
  ScreenFormField,
  ScreenStatus,
} from "./types";

import {
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: ScreenForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (field: ScreenFormField, value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ScreensModal({
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
    field: ScreenFormField,
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

        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier l'écran"
                : "Ajouter un écran"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configurez les écrans d&apos;affichage, leurs emplacements,
              groupes et contenus diffusés.
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

        <form onSubmit={onSubmit} className="space-y-5 p-6">

          {renderInput(
            "Nom de l'écran",
            "name",
            "Exemple : Écran entrée principale",
            true
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {renderInput(
              "Emplacement",
              "location",
              "Exemple : Hall d'accueil"
            )}

            {renderInput(
              "Groupe",
              "group",
              "Exemple : Salle de prière"
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Statut
              <span className="text-red-500"> *</span>
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                updateForm("status", event.target.value)
              }
              required
              className={inputClass}
            >
              {STATUS_OPTIONS.map((status: ScreenStatus) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Contenu diffusé
            </label>

            <textarea
              value={form.content}
              onChange={(event) =>
                updateForm("content", event.target.value)
              }
              placeholder="Annonces, horaires de prière, événements..."
              rows={5}
              className={inputClass}
            />
          </div>

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
                  : "Ajouter l'écran"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}