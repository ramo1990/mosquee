import { MosqueSettingsForm as FormType } from "./types";

type Props = {
  form: FormType;
  saving: boolean;
  updateForm: (
    field: keyof FormType,
    value: string
  ) => void;
  submitForm: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
};

export default function MosqueSettingsForm({
  form,
  saving,
  updateForm,
  submitForm,
}: Props) {
  return (
    <form onSubmit={submitForm} className="space-y-6">

      {/* Informations générales */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Informations générales
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <div className="md:col-span-2">
            <FormField
              label="Nom de la mosquée"
              value={form.name}
              onChange={(value) =>
                updateForm("name", value)
              }
              placeholder="Exemple : Mosquée Al-Nour"
              required
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Description"
              value={form.description}
              onChange={(value) =>
                updateForm("description", value)
              }
              placeholder="Présentation de la mosquée"
            />
          </div>

          <FormField
            label="Adresse"
            value={form.address}
            onChange={(value) =>
              updateForm("address", value)
            }
            placeholder="Exemple : 12 rue des Oliviers"
          />

          <FormField
            label="Ville"
            value={form.city}
            onChange={(value) =>
              updateForm("city", value)
            }
            placeholder="Exemple : Paris"
          />

          <FormField
            label="Code postal"
            value={form.postal_code}
            onChange={(value) =>
              updateForm("postal_code", value)
            }
            placeholder="Exemple : 75011"
          />

          <FormField
            label="Pays"
            value={form.country}
            onChange={(value) =>
              updateForm("country", value)
            }
            placeholder="Exemple : France"
          />

          <FormField
            label="Capacité"
            type="number"
            value={form.capacity}
            onChange={(value) =>
              updateForm("capacity", value)
            }
            placeholder="Exemple : 300"
          />

          <FormField
            label="Horaires d’ouverture"
            type="time"
            value={form.opening_time}
            onChange={(value) =>
              updateForm("opening_time", value)
            }
          />

          <FormField
            label="Horaires de fermeture"
            type="time"
            value={form.closing_time}
            onChange={(value) =>
              updateForm("closing_time", value)
            }
          />

        </div>
      </section>

      {/* Contacts */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Contacts
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <FormField
            label="Téléphone"
            value={form.phone}
            onChange={(value) =>
              updateForm("phone", value)
            }
            placeholder="Exemple : +33 1 23 45 67 89"
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) =>
              updateForm("email", value)
            }
            placeholder="Exemple : contact@mosquee.fr"
          />

          <FormField
            label="Site web"
            value={form.website}
            onChange={(value) =>
              updateForm("website", value)
            }
            placeholder="https://..."
          />

          <FormField
            label="Facebook"
            value={form.facebook_url}
            onChange={(value) =>
              updateForm("facebook_url", value)
            }
            placeholder="https://..."
          />

          <FormField
            label="Instagram"
            value={form.instagram_url}
            onChange={(value) =>
              updateForm("instagram_url", value)
            }
            placeholder="https://..."
          />

          <FormField
            label="YouTube"
            value={form.youtube_url}
            onChange={(value) =>
              updateForm("youtube_url", value)
            }
            placeholder="https://..."
          />

        </div>
      </section>

      {/* Identité visuelle */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Identité visuelle
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          <FormField
            label="Lien du logo"
            value={form.logo_url}
            onChange={(value) =>
              updateForm("logo_url", value)
            }
            placeholder="https://..."
          />

          <ColorField
            label="Couleur principale"
            value={form.primary_color}
            onChange={(value) =>
              updateForm("primary_color", value)
            }
          />

          <ColorField
            label="Couleur secondaire"
            value={form.secondary_color}
            onChange={(value) =>
              updateForm("secondary_color", value)
            }
          />

        </div>
      </section>

      {/* Enregistrement */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {saving
            ? "Enregistrement..."
            : "Enregistrer les paramètres"}
        </button>
      </div>

    </form>
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
        {required && (
          <span className="text-red-500"> *</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

// Champ couleur
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="color"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-gray-300 px-2"
      />
    </div>
  );
}