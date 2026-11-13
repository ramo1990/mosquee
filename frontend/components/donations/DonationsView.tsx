
"use client";

import type { Donation } from "./useDonations";

type DonationsViewProps = {
  donations: Donation[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (donation: Donation) => void;
  onMarkAsReceived: (id: number) => void;
};

function formatAmount(amount: number | string) {
  return `${Number(amount).toLocaleString("fr-FR")} FCFA`;
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("fr-FR");
}

export default function DonationsView({
  donations,
  loading,
  updatingId,
  onEdit,
  onMarkAsReceived,
}: DonationsViewProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
        <p className="mt-4 text-sm text-gray-500">
          Chargement des dons...
        </p>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <div className="text-4xl">🤲</div>
        <h3 className="mt-4 font-bold text-gray-900">
          Aucun don trouvé
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Les dons enregistrés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="font-bold text-gray-900">
          Historique des dons
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {donations.length} contribution(s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-4">Donateur</th>
              <th className="px-5 py-4">Projet</th>
              <th className="px-5 py-4">Montant</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Statut</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {donations.map((donation) => {
              const received = donation.status === "received";

              return (
                <tr key={donation.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">
                      {donation.donor_name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {donation.phone || "Aucun téléphone"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {donation.project_name || "Don général"}
                  </td>

                  <td className="px-5 py-4 font-extrabold text-gray-900">
                    {formatAmount(donation.amount)}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(donation.donation_date)}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      received
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {received ? "Reçu" : "En attente"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(donation)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
                      >
                        Modifier
                      </button>

                      {!received && (
                        <button
                          type="button"
                          onClick={() => onMarkAsReceived(donation.id)}
                          disabled={updatingId === donation.id}
                          className="rounded-lg bg-emerald-800 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
                        >
                          {updatingId === donation.id ? "..." : "Confirmer"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}