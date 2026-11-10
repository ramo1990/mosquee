import { Contribution } from "./types";
import ContributionsTable from "./ContributionsTable";

type Props = {
  contributions: Contribution[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (contribution: Contribution) => void;
  onMarkAsPaid: (contribution: Contribution) => void;
};

export default function ContributionsView({
  contributions,
  loading,
  updatingId,
  onEdit,
  onMarkAsPaid,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des cotisations
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {contributions.length} cotisation(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : contributions.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune cotisation trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle cotisation ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <ContributionsTable
          contributions={contributions}
          updatingId={updatingId}
          onEdit={onEdit}
          onMarkAsPaid={onMarkAsPaid}
        />
      )}
    </div>
  );
}