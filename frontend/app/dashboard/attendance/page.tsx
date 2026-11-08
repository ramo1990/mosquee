import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function AttendancePage() {
  return (
    <ModuleGuard module="attendance">
      <DashboardPagePlaceholder
        title="Gestion des présences"
        description="Enregistrez les présences, absences et retards des élèves."
      />
    </ModuleGuard>
  );
}