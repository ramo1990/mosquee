
"use client";

import { Activity, ActivityStatus } from "./types";
import ActivitiesTable from "./ActivitiesTable";

type ActivitiesViewProps = {
  activities: Activity[];
  loading: boolean;
  updatingId: number | null;

  onEdit: (activity: Activity) => void;
  onTogglePublication: (activity: Activity) => void;
  onChangeStatus: (
    activity: Activity,
    status: ActivityStatus
  ) => void;
};

export default function ActivitiesView({
  activities,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
  onChangeStatus,
}: ActivitiesViewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des activités
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {activities.length} activité(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg font-bold text-gray-800">
            Aucune activité trouvée
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Créez une nouvelle activité ou modifiez vos filtres.
          </p>
        </div>
      ) : (
        <ActivitiesTable
          activities={activities}
          updatingId={updatingId}
          onEdit={onEdit}
          onTogglePublication={onTogglePublication}
          onChangeStatus={onChangeStatus}
        />
      )}
    </div>
  );
}