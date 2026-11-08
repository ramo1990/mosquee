import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ActivitiesPage() {
  return (
    <ModuleGuard module="activities">
      <DashboardPagePlaceholder
        title="Activités et événements"
        description="Créez et suivez les activités, rencontres, formations et événements de la communauté."
      />
    </ModuleGuard>
  );
}