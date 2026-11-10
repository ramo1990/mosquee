
"use client";

import { SlideForm } from "./types";

type Props = {
  open: boolean;
  editing: boolean;
  form: SlideForm;
  saving: boolean;
  onChange: (field: keyof SlideForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function SlidesModal({
  open,
  editing,
  form,
  saving,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {editing
              ? "Modifier la diapositive"
              : "Créer une nouvelle diapositive"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-2xl text-gray-400 hover:text-gray-900 disabled:opacity-50"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Titre */}
            <div className="sm:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => onChange("title", value)}
                placeholder="Exemple : Bienvenue à la mosquée"
                required
              />
            </div>

            {/* Groupe */}
            <FormField
              label="Groupe d’écrans"
              value={form.screen_group}
              onChange={(value) => onChange("screen_group", value)}
              placeholder="Exemple : Accueil, Salle de prière"
            />

            {/* Ordre */}
            <FormField
              label="Ordre d’affichage"
              type="number"
              value={form.display_order}
              onChange={(value) => onChange("display_order", value)}
              placeholder="Exemple : 1"
              required
            />

            {/* Durée */}
            <FormField
              label="Durée en secondes"
              type="number"
              value={form.duration_seconds}
              onChange={(value) => onChange("duration_seconds", value)}
              placeholder="Exemple : 10"
              required
            />

            {/* Image */}
            <FormField
              label="Lien de l’image"
              value={form.image_url}
              onChange={(value) => onChange("image_url", value)}
              placeholder="https://..."
            />

            {/* Vidéo */}
            <FormField
              label="Lien de la vidéo"
              value={form.video_url}
              onChange={(value) => onChange("video_url", value)}
              placeholder="https://..."
            />

            {/* Contenu */}
            <div className="sm:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => onChange("content", value)}
                placeholder="Texte affiché sur la diapositive"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
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
              className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editing
                  ? "Enregistrer les modifications"
                  : "Créer la diapositive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? 1 : undefined}
        step={type === "number" ? 1 : undefined}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}