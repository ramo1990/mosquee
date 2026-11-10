
"use client";

import { ClassroomForm } from "./classroom.types";
import FormField from "./FormField";

type Props = {
  open: boolean;
  editing: boolean;
  form: ClassroomForm;
  saving: boolean;
  onChange: (field: keyof ClassroomForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ClassroomModal({
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
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {editing ? "Modifier la classe" : "Créer une nouvelle classe"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-900"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nom de la classe"
              value={form.name}
              onChange={(value) => onChange("name", value)}
              placeholder="Exemple : Classe A - Niveau 1"
              required
            />

            <FormField
              label="Niveau"
              value={form.level}
              onChange={(value) => onChange("level", value)}
              placeholder="Débutant, Intermédiaire, Avancé"
            />

            <div className="sm:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) => onChange("description", value)}
                placeholder="Description de la classe"
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
                  : "Créer la classe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
