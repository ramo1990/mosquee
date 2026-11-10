import type {
  CommitteeFormData,
} from "./committee.types";

type Props = {
  form: CommitteeFormData;
  saving: boolean;
  updateForm: (field: keyof CommitteeFormData, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function CommitteeCreateForm({
  form,
  saving,
  updateForm,
  onSubmit,
  onCancel,
}: Props) {
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
          {required && <span className="text-red-500"> *</span>}
        </label>

        <input
          type={type}
          value={form[field]}
          onChange={(event) => updateForm(field, event.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={type === "password" ? 8 : undefined}
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h3 className="text-lg font-bold text-gray-900">
        Ajouter un membre du comité
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {renderInput("Nom d'utilisateur", "username", "text", true)}
        {renderInput("Email", "email", "email", true)}
        {renderInput("Prénom", "first_name")}
        {renderInput("Nom", "last_name")}
        {renderInput("Téléphone", "phone", "tel")}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Fonction au comité
          </label>

          <select
            value={form.committee_role}
            onChange={(event) =>
              updateForm("committee_role", event.target.value)
            }
            className={inputClass}
          >
            <option value="president">Président</option>
            <option value="vice_president">Vice-président</option>
            <option value="secretary">Secrétaire</option>
            <option value="treasurer">Trésorier</option>
            <option value="member">Membre du comité</option>
          </select>
        </div>

        {renderInput("Mot de passe", "password", "password", true)}
        {renderInput(
          "Confirmer le mot de passe",
          "password_confirm",
          "password",
          true
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
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
  );
}