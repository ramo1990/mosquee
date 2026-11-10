
"use client";

import {
  ContributionForm,
  ContributionStatus,
  ContributionFormField,
  Member,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: ContributionForm;
  members: Member[];
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: ContributionFormField,
    value: string
  ) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ContributionsModal({
  open,
  form,
  members,
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
    field: ContributionFormField,
    type = "text",
    required = false,
    placeholder = ""
  ) {
    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
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
    <div className="fixed inset-0 z-150 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier la cotisation"
                : "Nouvelle cotisation"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enregistrer et suivre les cotisations des fidèles.
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

            {/* Fidèle */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Fidèle <span className="text-red-500">*</span>
              </label>

              <select
                value={form.member}
                onChange={(event) =>
                  updateForm("member", event.target.value)
                }
                required
                className={inputClass}
              >
                <option value="">
                  Sélectionner un fidèle
                </option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Montants */}
            {renderInput(
              "Montant attendu (€)",
              "amount",
              "number",
              true,
              "Exemple : 50"
            )}

            {renderInput(
              "Montant payé (€)",
              "amount_paid",
              "number",
              false,
              "Exemple : 25"
            )}

            {/* Statut */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm(
                    "status",
                    event.target.value as ContributionStatus
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

            {/* Dates */}
            {renderInput(
              "Date d'échéance",
              "due_date",
              "date"
            )}

            {renderInput(
              "Date de paiement",
              "paid_date",
              "date"
            )}

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
                placeholder="Précisions sur la cotisation..."
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
                  : "Créer la cotisation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
