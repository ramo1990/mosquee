import { Donation } from "./types";
import DonationsTable from "./DonationsTable";

type Props = {
  donations: Donation[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (donation: Donation) => void;
  onMarkAsReceived: (donation: Donation) => void;
};

export default function DonationsView({
  donations,
  loading,
  updatingId,
  onEdit,
  onMarkAsReceived,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des dons
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {donations.length} don(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : donations.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucun don trouvé
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Enregistrez un nouveau don ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <DonationsTable
          donations={donations}
          updatingId={updatingId}
          onEdit={onEdit}
          onMarkAsReceived={onMarkAsReceived}
        />
      )}
    </div>
  );
}