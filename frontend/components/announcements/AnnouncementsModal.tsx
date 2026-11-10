
"use client";

import {
  AnnouncementForm,
  TYPE_LABELS,
  TYPE_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./types";

import FormField from "./FormField";

type Props = {
  open: boolean;
  editing: boolean;
  form: AnnouncementForm;
  saving: boolean;
  onChange: (
    field: keyof AnnouncementForm,
    value: string | boolean
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function AnnouncementsModal({
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
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {editing ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
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

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => onChange("title", value)}
                placeholder="Exemple : Rappel : cours de Coran samedi"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d&apos;annonce
              </label>

              <select
                value={form.announcement_type}
                onChange={(event) =>
                  onChange("announcement_type", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priorité
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  onChange("priority", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Date de début"
              type="date"
              value={form.start_date}
              onChange={(value) => onChange("start_date", value)}
            />

            <FormField
              label="Date de fin"
              type="date"
              value={form.end_date}
              onChange={(value) => onChange("end_date", value)}
            />

            <div className="sm:col-span-2">
              <FormField
                label="Contenu"
                value={form.content}
                onChange={(value) => onChange("content", value)}
                placeholder="Détails de l'annonce"
              />
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.display_on_screens}
                onChange={(event) =>
                  onChange("display_on_screens", event.target.checked)
                }
                className="h-5 w-5 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
              />

              <span className="text-sm font-semibold text-gray-700">
                Afficher sur les écrans d&apos;affichage
              </span>
            </label>
          </div>

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
                  : "Créer l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}