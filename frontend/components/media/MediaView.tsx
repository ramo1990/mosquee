
import type { MediaItem, MediaType, MediaStatusFilter } from "./types";

import MediaFilters from "./MediaFilters";
import MediaTable from "./MediaTable";

type Props = {
  media: MediaItem[];
  loading: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  typeFilter: "all" | MediaType;
  setTypeFilter: (value: "all" | MediaType) => void;

  categoryFilter: string;
  setCategoryFilter: (value: string) => void;

  statusFilter: MediaStatusFilter;
  setStatusFilter: (value: MediaStatusFilter) => void;

  availableCategories: string[];

  onEdit: (media: MediaItem) => void;
  onTogglePublication: (media: MediaItem) => void;
};

export default function MediaView(props: Props) {
  return (
    <div className="space-y-4">
      <MediaFilters
        search={props.search}
        setSearch={props.setSearch}
        typeFilter={props.typeFilter}
        setTypeFilter={props.setTypeFilter}
        categoryFilter={props.categoryFilter}
        setCategoryFilter={props.setCategoryFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
        availableCategories={props.availableCategories}
      />

      <MediaTable
        media={props.media}
        loading={props.loading}
        updatingId={props.updatingId}
        onEdit={props.onEdit}
        onTogglePublication={props.onTogglePublication}
      />
    </div>
  );
}