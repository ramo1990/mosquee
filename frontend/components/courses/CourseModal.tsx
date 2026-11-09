"use client";

import { CourseForm, Teacher, Classroom } from "./types";

type Props = {
  open: boolean;
  form: CourseForm;
  teachers: Teacher[];
  classrooms: Classroom[];
  saving: boolean;
  editing: boolean;

  updateForm: (field: keyof CourseForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function CourseModal({
  open,
  form,
  teachers,
  classrooms,
  saving,
  editing,
  updateForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">

      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editing ? "Modifier le cours" : "Créer un nouveau cours"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations du cours.
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
          className="space-y-5 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <FormField
                label="Titre du cours"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Exemple : Mathématiques - Algèbre"
                required
              />
            </div>

            <FormField
              label="Matière"
              value={form.subject}
              onChange={(value) => updateForm("subject", value)}
              placeholder="Exemple : Mathématiques"
            />

            <FormField
              label="Horaires"
              value={form.schedule}
              onChange={(value) => updateForm("schedule", value)}
              placeholder="Exemple : Lundi, 14h00 - 16h00"
            />

            {/* Enseignant */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Enseignant
              </label>

              <select
                value={form.teacher}
                onChange={(event) =>
                  updateForm("teacher", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non attribué</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Classe */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Classe
              </label>

              <select
                value={form.classroom}
                onChange={(event) =>
                  updateForm("classroom", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="">Non affectée</option>

                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                rows={4}
                placeholder="Contenu, objectifs ou précisions sur le cours..."
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
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
                  : "Créer le cours"}
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}