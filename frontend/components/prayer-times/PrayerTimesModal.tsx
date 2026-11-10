
"use client";

import type { FormEvent } from "react";

import type {
  PrayerTimeForm,
} from "./types";

type PrayerTimeFormField = keyof PrayerTimeForm;

type Props = {
  open: boolean;
  form: PrayerTimeForm;
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: PrayerTimeFormField,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function PrayerTimesModal({
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
    field: PrayerTimeFormField,
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

  const prayers = [
    { label: "Fajr", field: "fajr" },
    { label: "Dhuhr", field: "dhuhr" },
    { label: "Asr", field: "asr" },
    { label: "Maghrib", field: "maghrib" },
    { label: "Isha", field: "isha" },
  ] as const;

  const iqamas = [
    { label: "Fajr iqama", field: "fajr_iqama" },
    { label: "Dhuhr iqama", field: "dhuhr_iqama" },
    { label: "Asr iqama", field: "asr_iqama" },
    { label: "Maghrib iqama", field: "maghrib_iqama" },
    { label: "Isha iqama", field: "isha_iqama" },
  ] as const;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier les horaires"
                : "Ajouter les horaires"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gérez les horaires de prière, l&apos;iqama et la Jumua.
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
        <form onSubmit={onSubmit} className="space-y-6 p-6">

          {/* Date et notes */}
          <div className="grid gap-4 md:grid-cols-2">
            {renderInput(
              "Date",
              "date",
              "date",
              true
            )}

            {renderInput(
              "Notes",
              "notes",
              "text",
              false,
              "Précisions éventuelles"
            )}
          </div>

          {/* Horaires Adhan */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Horaires Adhan
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {prayers.map((prayer) => (
                <div key={prayer.field}>
                  {renderInput(
                    prayer.label,
                    prayer.field,
                    "time"
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horaires Iqama */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Horaires Iqama
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {iqamas.map((iqama) => (
                <div key={iqama.field}>
                  {renderInput(
                    iqama.label,
                    iqama.field,
                    "time"
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Jumua */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              Jumua
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput(
                "Heure de la Jumua",
                "jumua_time",
                "time"
              )}

              {renderInput(
                "Heure de la khutbah",
                "jumua_khutbah_time",
                "time"
              )}
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
                  : "Ajouter les horaires"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
