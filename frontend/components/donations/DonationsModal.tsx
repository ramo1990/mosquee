
"use client";

import type { DonationForm } from "./useDonations";

type DonationsModalProps = {
  open: boolean;
  form: DonationForm;
  editingId: number | null;
  saving: boolean;
  updateForm: (field: keyof DonationForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function DonationsModal({
  open,
  form,
  editingId,
  saving,
  updateForm,
  onSubmit,
  onClose,
}: DonationsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="my-auto w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId ? "Modifier le don" : "Enregistrer un don"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Renseignez les informations de la contribution.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fermer"
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="donor_name" className="mb-2 block text-sm font-semibold text-gray-700">
              Nom du donateur *
            </label>
            <input
              id="donor_name"
              required
              value={form.donor_name}
              onChange={(e) => updateForm("donor_name", e.target.value)}
              placeholder="Nom complet"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-gray-700">
                Montant (FCFA) *
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                required
                value={form.amount}
                onChange={(e) => updateForm("amount", e.target.value)}
                placeholder="Ex : 25000"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="donation_date" className="mb-2 block text-sm font-semibold text-gray-700">
                Date du don *
              </label>
              <input
                id="donation_date"
                type="date"
                required
                value={form.donation_date}
                onChange={(e) => updateForm("donation_date", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="+225 07 00 00 00 00"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="project_name" className="mb-2 block text-sm font-semibold text-gray-700">
                Projet concerné
              </label>
              <input
                id="project_name"
                value={form.project_name}
                onChange={(e) => updateForm("project_name", e.target.value)}
                placeholder="Ex : Construction"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-semibold text-gray-700">
              Statut du don
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => updateForm("status", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="pending">En attente</option>
              <option value="received">Reçu</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-gray-700">
              Observations
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
              placeholder="Informations complémentaires..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Enregistrer le don"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}