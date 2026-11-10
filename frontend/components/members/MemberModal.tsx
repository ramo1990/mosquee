import type { MemberForm, Mosque } from "./members.types";

import MemberFormField from "./MemberFormField";

type Props = {
  open: boolean;
  isEditing: boolean;
  isSuperAdmin: boolean;
  mosques: Mosque[];

  form: MemberForm;
  saving: boolean;

  onChange: <K extends keyof MemberForm>(
    field: K,
    value: MemberForm[K]
  ) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MemberModal({
  open,
  isEditing,
  isSuperAdmin,
  mosques,
  form,
  saving,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {isEditing
              ? "Modifier le fidèle"
              : "Ajouter un fidèle"}
          </h2>

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

          {/* Sélection de la mosquée */}
          {isSuperAdmin && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mosquée
              </label>

              <select
                value={form.mosque}
                onChange={(event) =>
                  onChange("mosque", event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="">
                  Sélectionner une mosquée
                </option>

                {mosques.map((mosque) => (
                  <option
                    key={mosque.id}
                    value={mosque.id}
                  >
                    {mosque.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Informations personnelles */}
          <div className="grid gap-4 sm:grid-cols-2">

            <MemberFormField
              label="Prénom"
              value={form.first_name}
              onChange={(value) =>
                onChange("first_name", value)
              }
              required
            />

            <MemberFormField
              label="Nom"
              value={form.last_name}
              onChange={(value) =>
                onChange("last_name", value)
              }
              required
            />

            <MemberFormField
              label="Téléphone"
              value={form.phone}
              onChange={(value) =>
                onChange("phone", value)
              }
            />

            <MemberFormField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(value) =>
                onChange("email", value)
              }
            />

            <MemberFormField
              label="Adresse"
              value={form.address}
              onChange={(value) =>
                onChange("address", value)
              }
            />

          </div>

          {/* Statut */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Statut
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                onChange(
                  "status",
                  event.target.value as MemberForm["status"]
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border px-5 py-3 text-sm font-semibold disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Ajouter le fidèle"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}