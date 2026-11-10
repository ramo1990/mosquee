import {
  Contribution,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./types";

type Props = {
  contributions: Contribution[];
  updatingId: number | null;
  onEdit: (contribution: Contribution) => void;
  onMarkAsPaid: (contribution: Contribution) => void;
};

export default function ContributionsTable({
  contributions,
  updatingId,
  onEdit,
  onMarkAsPaid,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4">Fidèle</th>
            <th className="px-6 py-4">Montant</th>
            <th className="px-6 py-4">Payé</th>
            <th className="px-6 py-4">Échéance</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {contributions.map((contribution) => {
            const isUpdating =
              updatingId === contribution.id;

            return (
              <tr
                key={contribution.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {contribution.member_name ||
                      `Fidèle #${contribution.member}`}
                  </div>

                  {contribution.notes && (
                    <div className="mt-1 max-w-md text-xs text-gray-500">
                      {contribution.notes}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {contribution.amount} €
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {contribution.amount_paid ?? 0} €
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {contribution.due_date || "—"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      STATUS_COLORS[contribution.status]
                    }`}
                  >
                    {STATUS_LABELS[contribution.status]}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => onEdit(contribution)}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      Modifier
                    </button>

                    {contribution.status !== "paid" && (
                      <button
                        type="button"
                        onClick={() =>
                          onMarkAsPaid(contribution)
                        }
                        disabled={isUpdating}
                        className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                      >
                        {isUpdating
                          ? "Traitement..."
                          : "Marquer payée"}
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