import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

import {
  MosqueSettings,
  MosqueSettingsForm,
  EMPTY_FORM,
} from "./types";

export function useMosqueSettings() {
  const [settings, setSettings] =
    useState<MosqueSettings | null>(null);

  const [form, setForm] =
    useState<MosqueSettingsForm>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Convertir les données API en formulaire
  const mapSettingsToForm = (
    data: MosqueSettings
  ): MosqueSettingsForm => ({
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

  // Chargement des paramètres
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGet<MosqueSettings>(
        "/mosque-settings/"
      );

      setSettings(data);
      setForm(mapSettingsToForm(data));
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

  // Chargement initial
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
          setForm(mapSettingsToForm(data));
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

  // Modification d'un champ
  function updateForm(
    field: keyof MosqueSettingsForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Enregistrement
  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!settings) {
      setError(
        "Aucune configuration de mosquée disponible."
      );
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
      capacity: form.capacity
        ? Number(form.capacity)
        : null,
    };

    try {
      const updatedSettings = await apiPatch<MosqueSettings>(
        `/mosque-settings/${settings.id}/`,
        payload
      );

      setSettings(updatedSettings);
      setForm(mapSettingsToForm(updatedSettings));

      setSuccess(
        "Paramètres enregistrés avec succès."
      );
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

  return {
    settings,
    form,
    loading,
    saving,
    error,
    success,
    loadSettings,
    updateForm,
    submitForm,
  };
}