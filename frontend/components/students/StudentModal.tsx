import { StudentForm, Classroom } from "./types";

type Props = {
  open: boolean;
  form: StudentForm;
  classrooms: Classroom[];
  saving: boolean;

  updateForm: (field: keyof StudentForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function StudentModal({
  open,
  form,
  classrooms,
  saving,
  updateForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Inscrire un nouvel élève
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations de l&apos;élève.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Prénom"
              value={form.first_name}
              onChange={(value) =>
                updateForm("first_name", value)
              }
              required
            />

            <FormField
              label="Nom"
              value={form.last_name}
              onChange={(value) =>
                updateForm("last_name", value)
              }
              required
            />

            <FormField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                updateForm("email", value)
              }
            />

            <FormField
              label="Téléphone"
              type="tel"
              value={form.phone}
              onChange={(value) =>
                updateForm("phone", value)
              }
            />

            <FormField
              label="Date de naissance"
              type="date"
              value={form.birth_date}
              onChange={(value) =>
                updateForm("birth_date", value)
              }
            />

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
                <option value="">
                  Sélectionner une classe
                </option>

                {classrooms.map((classroom) => (
                  <option
                    key={classroom.id}
                    value={classroom.id}
                  >
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving ? "Inscription..." : "Inscrire l'élève"}
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
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}