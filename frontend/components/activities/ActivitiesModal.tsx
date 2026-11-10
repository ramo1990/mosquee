
"use client";

import {
  ActivityForm,
  TYPE_LABELS,
  TYPE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./types";

import FormField from "./FormField";

type Props = {
  open: boolean;
  editing: boolean;
  form: ActivityForm;
  saving: boolean;
  onChange: (field: keyof ActivityForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ActivitiesModal({
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
    <div className="fixed inset-0 z-150 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {editing
              ? "Modifier l'activité"
              : "Créer une nouvelle activité"}
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

            <div className="sm:col-span-2">
              <FormField
                label="Titre"
                value={form.title}
                onChange={(value) => onChange("title", value)}
                placeholder="Exemple : Journée portes ouvertes"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Type d&apos;activité
              </label>

              <select
                value={form.activity_type}
                onChange={(event) =>
                  onChange("activity_type", event.target.value)
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

            {/* Statut */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  onChange("status", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Lieu"
              value={form.location}
              onChange={(value) => onChange("location", value)}
              placeholder="Salle principale de la mosquée"
            />

            <FormField
              label="Organisateur"
              value={form.organizer}
              onChange={(value) => onChange("organizer", value)}
              placeholder="Exemple : Comité culturel"
            />

            <FormField
              label="Date de début"
              type="date"
              value={form.start_date}
              onChange={(value) => onChange("start_date", value)}
              required
            />

            <FormField
              label="Date de fin"
              type="date"
              value={form.end_date}
              onChange={(value) => onChange("end_date", value)}
            />

            <FormField
              label="Heure de début"
              type="time"
              value={form.start_time}
              onChange={(value) => onChange("start_time", value)}
            />

            <FormField
              label="Heure de fin"
              type="time"
              value={form.end_time}
              onChange={(value) => onChange("end_time", value)}
            />

            <FormField
              label="Nombre maximum de participants"
              type="number"
              value={form.max_participants}
              onChange={(value) =>
                onChange("max_participants", value)
              }
              placeholder="Exemple : 50"
            />

            <div className="sm:col-span-2">
              <FormField
                label="Description"
                value={form.description}
                onChange={(value) =>
                  onChange("description", value)
                }
                placeholder="Objectifs, programme ou informations pratiques"
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
                  : "Créer l'activité"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
