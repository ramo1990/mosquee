
import ReligiousCoursesModal from "./ReligiousCoursesModal";
import ReligiousCoursesFilters from "./ReligiousCoursesFilters";
import ReligiousCoursesTable from "./ReligiousCoursesTable";

import { useReligiousCourses } from "./useReligiousCourses";

type Props = {
  management: ReturnType<typeof useReligiousCourses>;
};

export default function ReligiousCoursesView({ management }: Props) {
  return (
    <div className="space-y-6">
      {management.showForm && (
        <ReligiousCoursesModal
          open={management.showForm}
          form={management.form}
          teachers={management.teachers}
          classrooms={management.classrooms}
          editingId={management.editingId}
          saving={management.saving}
          updateForm={management.updateForm}
          onSubmit={management.submitForm}
          onClose={management.closeForm}
        />
      )}

      <ReligiousCoursesFilters
        search={management.search}
        setSearch={management.setSearch}
        subjectFilter={management.subjectFilter}
        setSubjectFilter={management.setSubjectFilter}
        statusFilter={management.statusFilter}
        setStatusFilter={management.setStatusFilter}
      />

      <ReligiousCoursesTable
        courses={management.filteredCourses}
        loading={management.loading}
        updatingId={management.updatingId}
        onEdit={management.openEditForm}
        onToggleStatus={management.toggleStatus}
      />
    </div>
  );
}