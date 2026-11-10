"use client";

import { useMosqueSettings } from "./useMosqueSettings";
import MosqueSettingsForm from "./MosqueSettingsForm";

export default function MosqueSettingsManagement() {
  const {
    settings,
    form,
    loading,
    saving,
    error,
    success,
    loadSettings,
    updateForm,
    submitForm,
  } = useMosqueSettings();

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
            Paramètres de la mosquée
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Modifiez les informations générales, les contacts,
            l’identité visuelle et la configuration de la mosquée.
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
        <MosqueSettingsForm
          form={form}
          saving={saving}
          updateForm={updateForm}
          submitForm={submitForm}
        />
      )}

    </div>
  );
}