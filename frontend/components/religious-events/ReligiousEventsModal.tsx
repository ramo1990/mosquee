
"use client";

import type { FormEvent } from "react";
import type {
  ReligiousEventForm,
  ReligiousEventFormField,
  ReligiousEventType,
  EventStatus,
} from "./types";

import {
  TYPE_LABELS,
  TYPE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: ReligiousEventForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: ReligiousEventFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ReligiousEventsModal({
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
    field: ReligiousEventFormField,
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
          min={type === "number" ? 0 : undefined}
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
                ? "Modifier l'événement"
                : "Nouvel événement"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Créez et gérez les événements religieux,
              célébrations et rendez-vous spirituels.
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
            "Titre de l'événement",
            "title",
            "text",
            true,
            "Exemple : Conférence du mois de Ramadan"
          )}

          {/* Type et statut */}
          <div className="grid gap-4 md:grid-cols-2">

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
                {TYPE_OPTIONS.map((type: ReligiousEventType) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
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
                {STATUS_OPTIONS.map((status: EventStatus) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Lieu et organisateur */}
          <div className="grid gap-4 md:grid-cols-2">

            {renderInput(
              "Lieu",
              "location",
              "text",
              false,
              "Exemple : Salle principale de la mosquée"
            )}

            {renderInput(
              "Organisateur",
              "organizer",
              "text",
              false,
              "Exemple : Comité religieux"
            )}

          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">

            {renderInput(
              "Date de début",
              "start_date",
              "date",
              true
            )}

            {renderInput(
              "Date de fin",
              "end_date",
              "date"
            )}

          </div>

          {/* Horaires */}
          <div className="grid gap-4 md:grid-cols-2">

            {renderInput(
              "Heure de début",
              "start_time",
              "time"
            )}

            {renderInput(
              "Heure de fin",
              "end_time",
              "time"
            )}

          </div>

          {/* Participants */}
          {renderInput(
            "Nombre maximum de participants",
            "max_participants",
            "number",
            false,
            "Exemple : 100"
          )}

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
              placeholder="Programme, objectifs ou informations pratiques..."
              rows={5}
              className={inputClass}
            />
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
                  : "Créer l'événement"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}