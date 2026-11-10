
"use client";

import type { FormEvent } from "react";
import type {
  ReligiousCourseForm,
  ReligiousCourse,
  Teacher,
  Classroom,
} from "./types";

import {
  SUBJECT_LABELS,
  SUBJECT_OPTIONS,
} from "./types";

type Props = {
  open: boolean;
  form: ReligiousCourseForm;
  teachers: Teacher[];
  classrooms: Classroom[];
  editingId: number | null;
  saving: boolean;

  updateForm: (
    field: keyof ReligiousCourseForm,
    value: string
  ) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function ReligiousCoursesModal({
  open,
  form,
  teachers,
  classrooms,
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
    field: keyof ReligiousCourseForm,
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
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId !== null
                ? "Modifier le cours"
                : "Nouveau cours"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Créez et gérez les cours de Coran, hadith,
              fiqh, aqidah et autres enseignements religieux.
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
        <form onSubmit={onSubmit} className="space-y-5 p-6">

          {/* Titre */}
          {renderInput(
            "Titre du cours",
            "title",
            "text",
            true,
            "Exemple : Récitation du Coran - Niveau 1"
          )}

          {/* Matière et enseignant */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Matière
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={form.subject}
                onChange={(event) =>
                  updateForm("subject", event.target.value)
                }
                required
                className={inputClass}
              >
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject} value={subject}>
                    {SUBJECT_LABELS[subject]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Enseignant
              </label>

              <select
                value={form.teacher}
                onChange={(event) =>
                  updateForm("teacher", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Non attribué</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Classe et horaires */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Classe
              </label>

              <select
                value={form.classroom}
                onChange={(event) =>
                  updateForm("classroom", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Non affectée</option>

                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            {renderInput(
              "Horaires",
              "schedule",
              "text",
              false,
              "Exemple : Samedi, 10h00 - 12h00"
            )}

          </div>

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
              placeholder="Contenu, objectifs ou précisions sur le cours..."
              rows={5}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">

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
                  : "Créer le cours"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}