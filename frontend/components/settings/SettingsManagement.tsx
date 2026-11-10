"use client";

import { useSettings } from "./useSettings";
import SettingsForm from "./SettingsForm";

export default function SettingsManagement() {
  const {
    settings,
    loading,
    saving,
    error,
    success,
    loadSettings,
    updateField,
    submitForm,
  } = useSettings();

  return (
    <div className="space-y-6">

      {/* Erreur */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Succès */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
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

      {/* Chargement */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Chargement des paramètres...
        </div>
      ) : (
        <SettingsForm
          settings={settings}
          saving={saving}
          updateField={updateField}
          submitForm={submitForm}
        />
      )}

    </div>
  );
}