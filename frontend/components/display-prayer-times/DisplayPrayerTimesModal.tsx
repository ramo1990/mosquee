
"use client";

import {
  DisplayPrayerTimeForm,
  PRAYER_FIELDS,
  PRAYER_LABELS,
} from "./types";

type Props = {
  open: boolean;
  editing: boolean;
  form: DisplayPrayerTimeForm;
  saving: boolean;
  onChange: (
    field: keyof DisplayPrayerTimeForm,
    value: string
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function DisplayPrayerTimesModal({
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
      <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {editing
              ? "Modifier les horaires affichés"
              : "Ajouter les horaires affichés"}
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
        <form onSubmit={onSubmit} className="space-y-6 p-6">

          {/* Informations générales */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Date"
              type="date"
              value={form.date}
              onChange={(value) => onChange("date", value)}
              required
            />

            <FormField
              label="Groupe d’écrans"
              value={form.screen_group}
              onChange={(value) =>
                onChange("screen_group", value)
              }
              placeholder="Exemple : Accueil, Salle de prière"
            />
          </div>

          {/* Horaires adhan */}
          <div>
            <h3 className="mb-4 border-b pb-2 text-base font-bold text-gray-900">
              Horaires adhan
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PRAYER_FIELDS.map((prayer) => (
                <FormField
                  key={prayer}
                  label={PRAYER_LABELS[prayer]}
                  type="time"
                  value={form[prayer]}
                  onChange={(value) =>
                    onChange(prayer, value)
                  }
                />
              ))}
            </div>
          </div>

          {/* Horaires iqama */}
          <div>
            <h3 className="mb-4 border-b pb-2 text-base font-bold text-gray-900">
              Horaires iqama
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <FormField
                label="Fajr iqama"
                type="time"
                value={form.fajr_iqama}
                onChange={(value) =>
                  onChange("fajr_iqama", value)
                }
              />

              <FormField
                label="Dhuhr iqama"
                type="time"
                value={form.dhuhr_iqama}
                onChange={(value) =>
                  onChange("dhuhr_iqama", value)
                }
              />

              <FormField
                label="Asr iqama"
                type="time"
                value={form.asr_iqama}
                onChange={(value) =>
                  onChange("asr_iqama", value)
                }
              />

              <FormField
                label="Maghrib iqama"
                type="time"
                value={form.maghrib_iqama}
                onChange={(value) =>
                  onChange("maghrib_iqama", value)
                }
              />

              <FormField
                label="Isha iqama"
                type="time"
                value={form.isha_iqama}
                onChange={(value) =>
                  onChange("isha_iqama", value)
                }
              />
            </div>
          </div>

          {/* Jumua */}
          <div>
            <h3 className="mb-4 border-b pb-2 text-base font-bold text-gray-900">
              Jumua
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Heure de la Jumua"
                type="time"
                value={form.jumua_time}
                onChange={(value) =>
                  onChange("jumua_time", value)
                }
              />

              <FormField
                label="Heure de la khutbah"
                type="time"
                value={form.jumua_khutbah_time}
                onChange={(value) =>
                  onChange("jumua_khutbah_time", value)
                }
              />
            </div>
          </div>

          {/* Notes */}
          <FormField
            label="Notes"
            value={form.notes}
            onChange={(value) => onChange("notes", value)}
            placeholder="Précisions affichées sur les écrans"
          />

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
                  : "Enregistrer les horaires"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Champ réutilisable
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
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}