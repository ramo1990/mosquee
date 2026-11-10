
"use client";

import {
  DonationForm,
  DonationFormField,
  DonationStatus,
  Member,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: DonationForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: DonationFormField,
    value: string
  ) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function DonationsModal({
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
    field: DonationFormField,
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
          min={type === "number" ? "0" : undefined}
          step={type === "number" ? "0.01" : undefined}
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
                ? "Modifier le don"
                : "Nouveau don"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enregistrer et suivre les dons reçus pour les projets
              et activités de la mosquée.
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
          <div className="grid gap-4 md:grid-cols-2">

            {/* Donateur */}
            <div className="md:col-span-2">
              {renderInput(
                "Nom du donateur",
                "donor_name",
                "text",
                true,
                "Exemple : Famille Dupont"
              )}
            </div>

            {/* Montant */}
            {renderInput(
              "Montant (€)",
              "amount",
              "number",
              true,
              "Exemple : 100"
            )}

            {/* Projet */}
            {renderInput(
              "Projet",
              "project",
              "text",
              false,
              "Exemple : Rénovation de la mosquée"
            )}

            {/* Mode de paiement */}
            {renderInput(
              "Mode de paiement",
              "payment_method",
              "text",
              false,
              "Exemple : Espèces, virement, chèque"
            )}

            {/* Date */}
            {renderInput(
              "Date du don",
              "donation_date",
              "date"
            )}

            {/* Statut */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm(
                    "status",
                    event.target.value as DonationStatus
                  )
                }
                className={inputClass}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateForm("notes", event.target.value)
                }
                placeholder="Précisions sur le don..."
                rows={4}
                className={inputClass}
              />
            </div>
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
                  : "Enregistrer le don"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}