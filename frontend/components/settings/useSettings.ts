import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

import { Settings, EMPTY_SETTINGS } from "./types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(
    EMPTY_SETTINGS
  );

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
      console.error(
        "Erreur chargement des paramètres :",
        err
      );

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
      default_screen_group:
        settings.default_screen_group.trim(),
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

      setSuccess(
        "Paramètres enregistrés avec succès."
      );
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

  return {
    settings,
    loading,
    saving,
    error,
    success,
    loadSettings,
    updateField,
    submitForm,
  };
}