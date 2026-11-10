
import type {
  Imam,
  Sermon,
  SermonType,
  SermonStatusFilter,
} from "./types";

import SermonsFilters from "./SermonsFilters";
import SermonsTable from "./SermonsTable";

type Props = {
  imams: Imam[];
  sermons: Sermon[];
  loading: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  typeFilter: "all" | SermonType;
  setTypeFilter: (value: "all" | SermonType) => void;

  imamFilter: string;
  setImamFilter: (value: string) => void;

  statusFilter: SermonStatusFilter;
  setStatusFilter: (value: SermonStatusFilter) => void;

  onEdit: (sermon: Sermon) => void;
  onTogglePublication: (sermon: Sermon) => void;
};

export default function SermonsView(props: Props) {
  return (
    <div className="space-y-4">
      <SermonsFilters
        imams={props.imams}
        search={props.search}
        setSearch={props.setSearch}
        typeFilter={props.typeFilter}
        setTypeFilter={props.setTypeFilter}
        imamFilter={props.imamFilter}
        setImamFilter={props.setImamFilter}
        statusFilter={props.statusFilter}
        setStatusFilter={props.setStatusFilter}
      />

      <SermonsTable
        sermons={props.sermons}
        loading={props.loading}
        updatingId={props.updatingId}
        onEdit={props.onEdit}
        onTogglePublication={props.onTogglePublication}
      />
    </div>
  );
}