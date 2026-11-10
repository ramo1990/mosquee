
import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ImamsTeachersManagement from "@/components/staff/ImamsTeachersManagement";

export default function ImamsTeachersPage() {
  return (
    <ModuleGuard module="imams-teachers">
      <DashboardPagePlaceholder
        title="Imams et enseignants"
        description="Gérez les imams, enseignants, leurs spécialités et leurs affectations."
      >
        <ImamsTeachersManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}