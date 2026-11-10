
import ReligiousEventsModal from "./ReligiousEventsModal";
import ReligiousEventsFilters from "./ReligiousEventsFilters";
import ReligiousEventsTable from "./ReligiousEventsTable";

import { useReligiousEvents } from "./useReligiousEvents";

type Props = {
  management: ReturnType<typeof useReligiousEvents>;
};

export default function ReligiousEventsView({
  management,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Modale */}
      <ReligiousEventsModal
        open={management.showForm}
        form={management.form}
        editingId={management.editingId}
        saving={management.saving}
        updateForm={management.updateForm}
        onSubmit={management.submitForm}
        onClose={management.closeForm}
      />

      {/* Recherche et filtres */}
      <ReligiousEventsFilters
        search={management.search}
        setSearch={management.setSearch}
        typeFilter={management.typeFilter}
        setTypeFilter={management.setTypeFilter}
        statusFilter={management.statusFilter}
        setStatusFilter={management.setStatusFilter}
        publicationFilter={management.publicationFilter}
        setPublicationFilter={management.setPublicationFilter}
      />

      {/* Tableau */}
      <ReligiousEventsTable
        events={management.filteredEvents}
        loading={management.loading}
        updatingId={management.updatingId}
        onEdit={management.openEditForm}
        onTogglePublication={management.togglePublication}
        onChangeStatus={management.changeStatus}
      />

    </div>
  );
}