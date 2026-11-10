
"use client";

import type { FormEvent } from "react";
import type { Student, ProgressForm, ProgressFormField } from "./types";

type Props = {
  open: boolean;
  students: Student[];
  form: ProgressForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: ProgressFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function StudentProgressModal({
  open,
  students,
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
    field: ProgressFormField,
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
          step={type === "number" ? "any" : undefined}
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
                ? "Modifier l'évaluation"
                : "Nouvelle évaluation"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enregistrez les résultats et la progression de l'élève.
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

          {/* Élève */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Élève <span className="text-red-500">*</span>
            </label>

            <select
              value={form.student}
              onChange={(event) =>
                updateForm("student", event.target.value)
              }
              required
              className={inputClass}
            >
              <option value="">Sélectionner un élève</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          {renderInput(
            "Moyenne / Note",
            "average_score",
            "number",
            false,
            "Exemple : 15.5"
          )}

          {/* Appréciation */}
          {renderInput(
            "Appréciation",
            "appreciation",
            "text",
            false,
            "Exemple : Très bons progrès en récitation"
          )}

          {/* Points forts */}
          {renderInput(
            "Points forts",
            "strengths",
            "text",
            false,
            "Exemple : Mémorisation, participation, assiduité"
          )}

          {/* Difficultés */}
          {renderInput(
            "Difficultés",
            "difficulties",
            "text",
            false,
            "Exemple : Prononciation, révision, concentration"
          )}

          {/* Commentaires */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Commentaires
            </label>

            <textarea
              value={form.comments}
              onChange={(event) =>
                updateForm("comments", event.target.value)
              }
              placeholder="Observations générales..."
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
                  : "Enregistrer l'évaluation"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
