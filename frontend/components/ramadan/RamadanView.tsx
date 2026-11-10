
import type {
  RamadanDay,
  RamadanPublicationFilter,
} from "./types";

import RamadanFilters from "./RamadanFilters";
import RamadanTable from "./RamadanTable";

type Props = {
  days: RamadanDay[];
  loading: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  publicationFilter: RamadanPublicationFilter;
  setPublicationFilter: (
    value: RamadanPublicationFilter
  ) => void;

  onEdit: (day: RamadanDay) => void;
  onTogglePublication: (day: RamadanDay) => void;
};

export default function RamadanView(props: Props) {
  return (
    <div className="space-y-4">
      <RamadanFilters
        search={props.search}
        setSearch={props.setSearch}
        publicationFilter={props.publicationFilter}
        setPublicationFilter={props.setPublicationFilter}
      />

      <RamadanTable
        days={props.days}
        loading={props.loading}
        updatingId={props.updatingId}
        onEdit={props.onEdit}
        onTogglePublication={props.onTogglePublication}
      />
    </div>
  );
}