import {
  Donation,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./types";

type Props = {
  donations: Donation[];
  updatingId: number | null;

  onEdit: (donation: Donation) => void;
  onMarkAsReceived: (donation: Donation) => void;
};

export default function DonationsTable({
  donations,
  updatingId,
  onEdit,
  onMarkAsReceived,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4">Donateur</th>
            <th className="px-6 py-4">Montant</th>
            <th className="px-6 py-4">Projet</th>
            <th className="px-6 py-4">Paiement</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {donations.map((donation) => {
            const isUpdating =
              updatingId === donation.id;

            return (
              <tr
                key={donation.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {donation.donor_name}
                  </div>

                  {donation.notes && (
                    <div className="mt-1 max-w-md text-xs text-gray-500">
                      {donation.notes}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 font-bold text-gray-900">
                  {donation.amount} €
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {donation.project || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {donation.payment_method || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {donation.donation_date || "—"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[donation.status]}`}
                  >
                    {STATUS_LABELS[donation.status]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => onEdit(donation)}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Modifier
                    </button>

                    {donation.status !== "received" && (
                      <button
                        type="button"
                        onClick={() =>
                          onMarkAsReceived(donation)
                        }
                        disabled={isUpdating}
                        className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                      >
                        {isUpdating
                          ? "Traitement..."
                          : "Marquer reçu"}
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
  );
}