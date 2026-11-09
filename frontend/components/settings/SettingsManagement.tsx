"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type Settings = {
  mosque_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  language: string;
  timezone: string;
  currency: string;
  theme: "light" | "dark" | "system";
  default_screen_group: string;
  show_prayer_times: boolean;
  show_announcements: boolean;
  show_events: boolean;
  show_donations: boolean;
  auto_refresh_interval: string;
};

const EMPTY_SETTINGS: Settings = {
  mosque_name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  language: "fr",
  timezone: "Europe/Paris",
  currency: "EUR",
  theme: "system",
  default_screen_group: "",
  show_prayer_times: true,
  show_announcements: true,
  show_events: true,
  show_donations: true,
  auto_refresh_interval: "60",
};

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGet<Settings>("/settings/");

      setSettings({
        ...EMPTY_SETTINGS,
        ...data,
      });
    } catch (err) {
      console.error("Erreur chargement des paramètres :", err);
      setError(
        "Impossible de charger les paramètres pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiGet<Settings>("/settings/");

        if (!ignore) {
          setSettings({
            ...EMPTY_SETTINGS,
            ...data,
          });
        }
      } catch (err) {
        console.error(
          "Erreur chargement des paramètres :",
          err
        );

        if (!ignore) {
          setError(
            "Impossible de charger les paramètres pour le moment."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  function updateField<K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      mosque_name: settings.mosque_name.trim(),
      address: settings.address.trim(),
      phone: settings.phone.trim(),
      email: settings.email.trim(),
      website: settings.website.trim(),
      language: settings.language,
      timezone: settings.timezone,
      currency: settings.currency,
      theme: settings.theme,
      default_screen_group: settings.default_screen_group.trim(),
      show_prayer_times: settings.show_prayer_times,
      show_announcements: settings.show_announcements,
      show_events: settings.show_events,
      show_donations: settings.show_donations,
      auto_refresh_interval: Number(
        settings.auto_refresh_interval
      ),
    };

    try {
      const updatedSettings = await apiPatch<Settings>(
        "/settings/",
        payload
      );

      setSettings({
        ...EMPTY_SETTINGS,
        ...updatedSettings,
      });

      setSuccess("Paramètres enregistrés avec succès.");
    } catch (err) {
      console.error(
        "Erreur enregistrement des paramètres :",
        err
      );
      setError(
        "Impossible d’enregistrer les paramètres pour le moment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Paramètres
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configurez les informations générales, l’apparence et les préférences de l’application.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Chargement des paramètres...
        </div>
      ) : (
        <form
          onSubmit={submitForm}
          className="space-y-6"
        >
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

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Préférences d’affichage
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Langue
                </label>

                <select
                  value={settings.language}
                  onChange={(event) =>
                    updateField("language", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fuseau horaire
                </label>

                <select
                  value={settings.timezone}
                  onChange={(event) =>
                    updateField("timezone", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="Europe/Paris">
                    Europe/Paris
                  </option>

                  <option value="Europe/London">
                    Europe/London
                  </option>

                  <option value="Africa/Casablanca">
                    Africa/Casablanca
                  </option>

                  <option value="Africa/Algiers">
                    Africa/Algiers
                  </option>

                  <option value="Africa/Tunis">
                    Africa/Tunis
                  </option>

                  <option value="Asia/Riyadh">
                    Asia/Riyadh
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Devise
                </label>

                <select
                  value={settings.currency}
                  onChange={(event) =>
                    updateField("currency", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">
                    Dollar américain (USD)
                  </option>

                  <option value="MAD">
                    Dirham marocain (MAD)
                  </option>

                  <option value="DZD">
                    Dinar algérien (DZD)
                  </option>

                  <option value="TND">
                    Dinar tunisien (TND)
                  </option>

                  <option value="SAR">
                    Riyal saoudien (SAR)
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Thème
                </label>

                <select
                  value={settings.theme}
                  onChange={(event) =>
                    updateField(
                      "theme",
                      event.target.value as
                        | "light"
                        | "dark"
                        | "system"
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option value="system">Système</option>
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </select>
              </div>

              <FormField
                label="Actualisation automatique (secondes)"
                type="number"
                value={settings.auto_refresh_interval}
                onChange={(value) =>
                  updateField(
                    "auto_refresh_interval",
                    value
                  )
                }
                placeholder="Exemple : 60"
              />
            </div>
          </div>

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
      )}
    </div>
  );
}

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
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-emerald-700"
      />
    </label>
  );
}