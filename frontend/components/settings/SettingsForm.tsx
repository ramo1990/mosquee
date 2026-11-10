import { Settings } from "./types";

type SettingsFormProps = {
  settings: Settings;
  saving: boolean;
  updateField: <K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) => void;
  submitForm: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
};

export default function SettingsForm({
  settings,
  saving,
  updateField,
  submitForm,
}: SettingsFormProps) {
  return (
    <form onSubmit={submitForm} className="space-y-6">

      {/* Informations générales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Informations générales
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField
            label="Nom de la mosquée"
            value={settings.mosque_name}
            onChange={(value) =>
              updateField("mosque_name", value)
            }
            placeholder="Exemple : Mosquée Al-Nour"
            required
          />

          <FormField
            label="Adresse"
            value={settings.address}
            onChange={(value) =>
              updateField("address", value)
            }
            placeholder="Exemple : 12 rue des Lilas, Paris"
          />

          <FormField
            label="Téléphone"
            value={settings.phone}
            onChange={(value) =>
              updateField("phone", value)
            }
            placeholder="Exemple : +33 1 23 45 67 89"
          />

          <FormField
            label="Email"
            type="email"
            value={settings.email}
            onChange={(value) =>
              updateField("email", value)
            }
            placeholder="Exemple : contact@mosquee.fr"
          />

          <FormField
            label="Site web"
            value={settings.website}
            onChange={(value) =>
              updateField("website", value)
            }
            placeholder="https://..."
          />

          <FormField
            label="Groupe d’écrans par défaut"
            value={settings.default_screen_group}
            onChange={(value) =>
              updateField("default_screen_group", value)
            }
            placeholder="Exemple : Accueil"
          />
        </div>
      </div>

      {/* Préférences d'affichage */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Préférences d&apos;affichage
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">

          <SelectField
            label="Langue"
            value={settings.language}
            onChange={(value) =>
              updateField("language", value)
            }
            options={[
              ["fr", "Français"],
              ["ar", "العربية"],
              ["en", "English"],
            ]}
          />

          <SelectField
            label="Fuseau horaire"
            value={settings.timezone}
            onChange={(value) =>
              updateField("timezone", value)
            }
            options={[
              ["Europe/Paris", "Europe/Paris"],
              ["Europe/London", "Europe/London"],
              ["Africa/Casablanca", "Africa/Casablanca"],
              ["Africa/Algiers", "Africa/Algiers"],
              ["Africa/Tunis", "Africa/Tunis"],
              ["Asia/Riyadh", "Asia/Riyadh"],
            ]}
          />

          <SelectField
            label="Devise"
            value={settings.currency}
            onChange={(value) =>
              updateField("currency", value)
            }
            options={[
              ["EUR", "Euro (EUR)"],
              ["USD", "Dollar américain (USD)"],
              ["MAD", "Dirham marocain (MAD)"],
              ["DZD", "Dinar algérien (DZD)"],
              ["TND", "Dinar tunisien (TND)"],
              ["SAR", "Riyal saoudien (SAR)"],
            ]}
          />

          <SelectField
            label="Thème"
            value={settings.theme}
            onChange={(value) =>
              updateField(
                "theme",
                value as Settings["theme"]
              )
            }
            options={[
              ["system", "Système"],
              ["light", "Clair"],
              ["dark", "Sombre"],
            ]}
          />

          <FormField
            label="Actualisation automatique (secondes)"
            type="number"
            value={settings.auto_refresh_interval}
            onChange={(value) =>
              updateField("auto_refresh_interval", value)
            }
            placeholder="Exemple : 60"
          />
        </div>
      </div>

      {/* Contenus affichés */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">
          Contenus affichés
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <ToggleField
            label="Afficher les horaires de prière"
            checked={settings.show_prayer_times}
            onChange={(value) =>
              updateField("show_prayer_times", value)
            }
          />

          <ToggleField
            label="Afficher les annonces"
            checked={settings.show_announcements}
            onChange={(value) =>
              updateField("show_announcements", value)
            }
          />

          <ToggleField
            label="Afficher les événements"
            checked={settings.show_events}
            onChange={(value) =>
              updateField("show_events", value)
            }
          />

          <ToggleField
            label="Afficher les dons"
            checked={settings.show_donations}
            onChange={(value) =>
              updateField("show_donations", value)
            }
          />

        </div>
      </div>

      {/* Bouton d'enregistrement */}
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

// Liste déroulante
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

// Interrupteur
function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 accent-emerald-700"
      />
    </label>
  );
}