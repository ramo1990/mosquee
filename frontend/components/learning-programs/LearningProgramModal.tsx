"use client";

import { ProgramForm } from "./types";

type Props = {
  open: boolean;
  form: ProgramForm;
  saving: boolean;
  editing: boolean;

  updateForm: (field: keyof ProgramForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function LearningProgramModal({
  open,
  form,
  saving,
  editing,
  updateForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">

      <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editing
                ? "Modifier le programme"
                : "Créer un nouveau programme"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations pédagogiques du programme.
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
        <form
          onSubmit={onSubmit}
          className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Titre */}
            <div className="sm:col-span-2">
              <FormField
                label="Titre du programme"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Programme Coran - Niveau débutant"
                required
              />
            </div>

            {/* Niveau */}
            <FormField
              label="Niveau"
              value={form.level}
              onChange={(value) => updateForm("level", value)}
              placeholder="Débutant, Intermédiaire, Avancé"
            />

            {/* Durée */}
            <FormField
              label="Durée en semaines"
              type="number"
              value={form.duration_weeks}
              onChange={(value) => updateForm("duration_weeks", value)}
              placeholder="Exemple : 12"
              min="1"
            />

            {/* Description */}
            <div className="sm:col-span-2">
              <TextAreaField
                label="Description"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Présentation générale du programme..."
                rows={3}
              />
            </div>

            {/* Objectifs */}
            <div className="sm:col-span-2">
              <TextAreaField
                label="Objectifs pédagogiques"
                value={form.objectives}
                onChange={(value) => updateForm("objectives", value)}
                placeholder="Exemple : mémoriser les sourates courtes, améliorer la récitation..."
                rows={4}
              />
            </div>

            {/* Contenu */}
            <div className="sm:col-span-2">
              <TextAreaField
                label="Contenu pédagogique"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Modules, leçons, supports et activités..."
                rows={5}
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
                : editing
                  ? "Enregistrer les modifications"
                  : "Créer le programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Champ texte
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

// Champ texte multiligne
function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}