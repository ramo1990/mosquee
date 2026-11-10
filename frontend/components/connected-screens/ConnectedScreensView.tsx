
"use client";

import type {
  ConnectedScreen,
  ScreenActionType,
  ScreenStatusFilter,
} from "./types";

import ConnectedScreensFilters from "./ConnectedScreensFilters";
import ConnectedScreensTable from "./ConnectedScreensTable";

type Props = {
  screens: ConnectedScreen[];
  filteredScreens: ConnectedScreen[];

  loading: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  statusFilter: ScreenStatusFilter;
  setStatusFilter: (value: ScreenStatusFilter) => void;

  groupFilter: string;
  setGroupFilter: (value: string) => void;

  availableGroups: string[];

  onAction: (
    screenId: number,
    action: ScreenActionType
  ) => void;
};

export default function ConnectedScreensView({
  filteredScreens,
  loading,
  updatingId,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  groupFilter,
  setGroupFilter,
  availableGroups,
  onAction,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Recherche et filtres */}
      <ConnectedScreensFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        availableGroups={availableGroups}
      />

      {/* Tableau */}
      <ConnectedScreensTable
        screens={filteredScreens}
        loading={loading}
        updatingId={updatingId}
        onAction={onAction}
      />

    </div>
  );
}