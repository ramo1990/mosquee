
"use client";

import type { FormEvent } from "react";

import type {
  RamadanDayForm,
  RamadanFormField,
} from "./types";

type Props = {
  open: boolean;
  form: RamadanDayForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: RamadanFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function RamadanModal({
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
    field: RamadanFormField,
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
          min={type === "number" ? 1 : undefined}
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
                ? "Modifier la journée"
                : "Nouvelle journée de Ramadan"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les horaires et les activités de cette journée.
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

          {/* Jour et date */}
          <div className="grid gap-4 md:grid-cols-2">
            {renderInput(
              "Numéro du jour",
              "day_number",
              "number",
              true,
              "Exemple : 1"
            )}

            {renderInput(
              "Date",
              "date",
              "date",
              true
            )}
          </div>

          {/* Horaires */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Horaires de la journée
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              {renderInput(
                "Fin du Suhoor",
                "suhoor_end_time",
                "time"
              )}

              {renderInput(
                "Iftar",
                "iftar_time",
                "time"
              )}

              {renderInput(
                "Tarawih",
                "tarawih_time",
                "time"
              )}
            </div>
          </div>

          {/* Activité */}
          {renderInput(
            "Activité",
            "activity",
            "text",
            false,
            "Exemple : Conférence, repas communautaire, lecture du Coran"
          )}

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateForm("notes", event.target.value)
              }
              placeholder="Précisions sur la journée..."
              rows={4}
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
                  : "Ajouter la journée"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}