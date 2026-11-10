
"use client";

import type { FormEvent } from "react";
import type { Member, TaskForm, TaskFormField } from "./types";

import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  members: Member[];
  form: TaskForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: TaskFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function TasksModal({
  open,
  members,
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
    field: TaskFormField,
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
                ? "Modifier la tâche"
                : "Nouvelle tâche"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Créez, attribuez et suivez les tâches administratives du comité.
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
            "Exemple : Préparer la réunion du comité"
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
              placeholder="Détails de la tâche..."
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Statut et priorité */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut <span className="text-red-500">*</span>
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm("status", event.target.value)
                }
                required
                className={inputClass}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priorité <span className="text-red-500">*</span>
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateForm("priority", event.target.value)
                }
                required
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Responsable */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Assignée à
            </label>

            <select
              value={form.assigned_to}
              onChange={(event) =>
                updateForm("assigned_to", event.target.value)
              }
              className={inputClass}
            >
              <option value="">Non assignée</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Échéance */}
          {renderInput(
            "Échéance",
            "due_date",
            "date"
          )}

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
                  : "Créer la tâche"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}