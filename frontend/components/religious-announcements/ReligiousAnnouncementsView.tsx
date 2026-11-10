
"use client";

import {
  ReligiousAnnouncement,
  AnnouncementForm,
  AnnouncementTypeFilter,
  AnnouncementPriorityFilter,
  AnnouncementStatusFilter,
} from "./types";

import ReligiousAnnouncementsFilters from "./ReligiousAnnouncementsFilters";
import ReligiousAnnouncementsModal from "./ReligiousAnnouncementsModal";
import ReligiousAnnouncementsTable from "./ReligiousAnnouncementsTable";

type Props = {
  announcements: ReligiousAnnouncement[];
  filteredAnnouncements: ReligiousAnnouncement[];

  loading: boolean;
  saving: boolean;
  updatingId: number | null;

  search: string;
  setSearch: (value: string) => void;

  typeFilter: AnnouncementTypeFilter;
  setTypeFilter: (value: AnnouncementTypeFilter) => void;

  priorityFilter: AnnouncementPriorityFilter;
  setPriorityFilter: (value: AnnouncementPriorityFilter) => void;

  statusFilter: AnnouncementStatusFilter;
  setStatusFilter: (value: AnnouncementStatusFilter) => void;

  showForm: boolean;
  editingId: number | null;
  form: AnnouncementForm;

  updateForm: (
    field: keyof AnnouncementForm,
    value: string
  ) => void;

  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  closeForm: () => void;

  openEditForm: (announcement: ReligiousAnnouncement) => void;
  togglePublication: (announcement: ReligiousAnnouncement) => void;
};

export default function ReligiousAnnouncementsView({
  announcements,
  filteredAnnouncements,
  loading,
  saving,
  updatingId,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  showForm,
  editingId,
  form,
  updateForm,
  submitForm,
  closeForm,
  openEditForm,
  togglePublication,
}: Props) {
  return (
    <div className="space-y-6">

      <ReligiousAnnouncementsModal
        open={showForm}
        form={form}
        saving={saving}
        editing={editingId !== null}
        updateForm={updateForm}
        onSubmit={submitForm}
        onClose={closeForm}
      />

      <ReligiousAnnouncementsFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ReligiousAnnouncementsTable
        announcements={filteredAnnouncements}
        loading={loading}
        updatingId={updatingId}
        onEdit={openEditForm}
        onTogglePublication={togglePublication}
      />
    </div>
  );
}