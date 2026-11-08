import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function AssignmentsPage() {
  return (
    <ModuleGuard module="assignments">
      <DashboardPagePlaceholder
        title="Devoirs et évaluations"
        description="Publiez les devoirs, contrôles et évaluations destinés aux élèves."
      />
    </ModuleGuard>
  );
}