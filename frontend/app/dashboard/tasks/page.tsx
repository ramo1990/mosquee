import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function TasksPage() {
  return (
    <ModuleGuard module="tasks">
      <DashboardPagePlaceholder
        title="Tâches du comité"
        description="Créez, attribuez et suivez les tâches administratives du comité."
      />
    </ModuleGuard>
  );
}