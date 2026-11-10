
"use client";

import type { FormEvent } from "react";

import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_OPTIONS,
  type IslamicEventForm,
  type IslamicEventFormField,
} from "./types";

type Props = {
  open: boolean;
  form: IslamicEventForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: IslamicEventFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function IslamicCalendarModal({
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
    field: IslamicEventFormField,
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
                ? "Modifier l'événement"
                : "Nouvel événement religieux"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les événements importants du calendrier islamique.
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
            "Titre de l'événement",
            "title",
            "text",
            true,
            "Exemple : Aïd al-Fitr"
          )}

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Type d'événement
              <span className="text-red-500"> *</span>
            </label>

            <select
              value={form.event_type}
              onChange={(event) =>
                updateForm("event_type", event.target.value)
              }
              required
              className={inputClass}
            >
              {EVENT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {EVENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Dates de l'événement
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput(
                "Date hégirienne",
                "hijri_date",
                "text",
                false,
                "Exemple : 1 Shawwal 1447"
              )}

              {renderInput(
                "Date grégorienne",
                "gregorian_date",
                "date"
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              placeholder="Signification, pratiques ou précisions sur cet événement..."
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
                  : "Ajouter l'événement"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}