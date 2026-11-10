import type { CommitteeFormData } from "./committee.types";

type Props = {
  open: boolean;
  form: CommitteeFormData;
  saving: boolean;

  updateForm: (
    field: keyof CommitteeFormData,
    value: string
  ) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function CommitteeCreateModal({
  open,
  form,
  saving,
  updateForm,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600";

  function renderInput(
    label: string,
    field: keyof CommitteeFormData,
    type = "text",
    required = false,
    placeholder = ""
  ) {
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
          value={form[field]}
          onChange={(event) =>
            updateForm(field, event.target.value)
          }
          placeholder={placeholder}
          required={required}
          minLength={type === "password" ? 8 : undefined}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Ajouter un membre du comité
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations du nouveau membre.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-2xl text-gray-400 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="space-y-5 p-6">

          <div className="grid gap-4 md:grid-cols-2">

            {renderInput(
              "Nom d'utilisateur",
              "username",
              "text",
              true,
              "Exemple : ahmed.benali"
            )}

            {renderInput(
              "Email",
              "email",
              "email",
              true,
              "Exemple : ahmed@mosquee.fr"
            )}

            {renderInput(
              "Prénom",
              "first_name",
              "text",
              false,
              "Exemple : Ahmed"
            )}

            {renderInput(
              "Nom",
              "last_name",
              "text",
              false,
              "Exemple : Benali"
            )}

            {renderInput(
              "Téléphone",
              "phone",
              "tel",
              false,
              "+33 6 12 34 56 78"
            )}

            {/* Fonction */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Fonction au comité
              </label>

              <select
                value={form.committee_role}
                onChange={(event) =>
                  updateForm(
                    "committee_role",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="president">Président</option>
                <option value="vice_president">
                  Vice-président
                </option>
                <option value="secretary">Secrétaire</option>
                <option value="treasurer">Trésorier</option>
                <option value="member">Membre du comité</option>
              </select>
            </div>

            {renderInput(
              "Mot de passe",
              "password",
              "password",
              true,
              "Minimum 8 caractères"
            )}

            {renderInput(
              "Confirmer le mot de passe",
              "password_confirm",
              "password",
              true,
              "Confirmez le mot de passe"
            )}

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving ? "Création..." : "Créer le membre"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}