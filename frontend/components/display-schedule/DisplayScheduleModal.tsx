
"use client";

import type { FormEvent } from "react";

import type {
  ScheduleForm,
  ScheduleFormField,
} from "./types";

type Props = {
  open: boolean;
  form: ScheduleForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: ScheduleFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function DisplayScheduleModal({
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
    field: ScheduleFormField,
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
                ? "Modifier la programmation"
                : "Nouvelle programmation"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les contenus, les horaires et les priorités
              d&apos;affichage sur les écrans.
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
            "Exemple : Annonce du vendredi"
          )}

          {/* Groupe et priorité */}
          <div className="grid gap-4 md:grid-cols-2">
            {renderInput(
              "Groupe d'écrans",
              "screen_group",
              "text",
              false,
              "Exemple : Accueil, Salle de prière"
            )}

            {renderInput(
              "Priorité",
              "priority",
              "number",
              true,
              "Exemple : 1"
            )}
          </div>

          {/* Programmation */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Période de diffusion
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput(
                "Date et heure de début",
                "start_datetime",
                "datetime-local",
                true
              )}

              {renderInput(
                "Date et heure de fin",
                "end_datetime",
                "datetime-local",
                true
              )}
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
              placeholder="Texte ou description du contenu diffusé..."
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
                  : "Créer la programmation"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}