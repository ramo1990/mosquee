"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type MosqueSettings = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  opening_time?: string;
  closing_time?: string;
  capacity?: number | null;
  is_active: boolean;
};

type MosqueSettingsForm = {
  name: string;
  description: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  opening_time: string;
  closing_time: string;
  capacity: string;
};

const EMPTY_FORM: MosqueSettingsForm = {
  name: "",
  description: "",
  address: "",
  city: "",
  postal_code: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  logo_url: "",
  primary_color: "#047857",
  secondary_color: "#065f46",
  opening_time: "",
  closing_time: "",
  capacity: "",
};

export default function MosqueSettingsManagement() {
  const [settings, setSettings] = useState<MosqueSettings | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<MosqueSettingsForm>(EMPTY_FORM);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGet<MosqueSettings>(
        "/mosque-settings/"
      );

      setSettings(data);

      setForm({
        name: data.name ?? "",
        description: data.description ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        postal_code: data.postal_code ?? "",
        country: data.country ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        website: data.website ?? "",
        facebook_url: data.facebook_url ?? "",
        instagram_url: data.instagram_url ?? "",
        youtube_url: data.youtube_url ?? "",
        logo_url: data.logo_url ?? "",
        primary_color: data.primary_color ?? "#047857",
        secondary_color: data.secondary_color ?? "#065f46",
        opening_time: data.opening_time ?? "",
        closing_time: data.closing_time ?? "",
        capacity:
          data.capacity === null || data.capacity === undefined
            ? ""
            : String(data.capacity),
      });
    } catch (err) {
      console.error(
        "Erreur chargement des paramètres de la mosquée :",
        err
      );
      setSettings(null);
      setError(
        "Impossible de charger les paramètres de la mosquée pour le moment."
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
        const data = await apiGet<MosqueSettings>(
          "/mosque-settings/"
        );

        if (!ignore) {
          setSettings(data);

          setForm({
            name: data.name ?? "",
            description: data.description ?? "",
            address: data.address ?? "",
            city: data.city ?? "",
            postal_code: data.postal_code ?? "",
            country: data.country ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            website: data.website ?? "",
            facebook_url: data.facebook_url ?? "",
            instagram_url: data.instagram_url ?? "",
            youtube_url: data.youtube_url ?? "",
            logo_url: data.logo_url ?? "",
            primary_color: data.primary_color ?? "#047857",
            secondary_color: data.secondary_color ?? "#065f46",
            opening_time: data.opening_time ?? "",
            closing_time: data.closing_time ?? "",
            capacity:
              data.capacity === null ||
              data.capacity === undefined
                ? ""
                : String(data.capacity),
          });
        }
      } catch (err) {
        console.error(
          "Erreur chargement des paramètres de la mosquée :",
          err
        );

        if (!ignore) {
          setSettings(null);
          setError(
            "Impossible de charger les paramètres de la mosquée pour le moment."
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

  function updateForm(
    field: keyof MosqueSettingsForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!settings) {
      setError("Aucune configuration de mosquée disponible.");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      postal_code: form.postal_code.trim() || undefined,
      country: form.country.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined,
      facebook_url: form.facebook_url.trim() || undefined,
      instagram_url: form.instagram_url.trim() || undefined,
      youtube_url: form.youtube_url.trim() || undefined,
      logo_url: form.logo_url.trim() || undefined,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      opening_time: form.opening_time || undefined,
      closing_time: form.closing_time || undefined,
      capacity: form.capacity ? Number(form.capacity) : null,
    };

    try {
      const updatedSettings = await apiPatch<MosqueSettings>(
        `/mosque-settings/${settings.id}/`,
        payload
      );

      setSettings(updatedSettings);
      setSuccess("Paramètres enregistrés avec succès.");
    } catch (err) {
      console.error(
        "Erreur enregistrement des paramètres :",
        err
      );
      setError(
        "Impossible d'enregistrer les paramètres de la mosquée."
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
            Paramètres de la mosquée
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Modifiez les informations générales, les contacts, l’identité visuelle et la configuration de la mosquée.
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
      ) : !settings ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune configuration disponible
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Vérifiez que l’API des paramètres de la mosquée est accessible.
          </p>
        </div>
      ) : (
        <form
          onSubmit={submitForm}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Informations générales
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField
                  label="Nom de la mosquée"
                  value={form.name}
                  onChange={(value) => updateForm("name", value)}
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
                onChange={(value) => updateForm("address", value)}
                placeholder="Exemple : 12 rue des Oliviers"
              />

              <FormField
                label="Ville"
                value={form.city}
                onChange={(value) => updateForm("city", value)}
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
                onChange={(value) => updateForm("country", value)}
                placeholder="Exemple : France"
              />

              <FormField
                label="Capacité"
                type="number"
                value={form.capacity}
                onChange={(value) => updateForm("capacity", value)}
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

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Contacts
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FormField
                label="Téléphone"
                value={form.phone}
                onChange={(value) => updateForm("phone", value)}
                placeholder="Exemple : +33 1 23 45 67 89"
              />

              <FormField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
                placeholder="Exemple : contact@mosquee.fr"
              />

              <FormField
                label="Site web"
                value={form.website}
                onChange={(value) => updateForm("website", value)}
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

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Identité visuelle
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FormField
                label="Lien du logo"
                value={form.logo_url}
                onChange={(value) => updateForm("logo_url", value)}
                placeholder="https://..."
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Couleur principale
                </label>

                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(event) =>
                    updateForm("primary_color", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-300 px-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Couleur secondaire
                </label>

                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(event) =>
                    updateForm("secondary_color", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-300 px-2"
                />
              </div>
            </div>
          </section>

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