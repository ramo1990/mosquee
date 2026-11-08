import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ClassesPage() {
  return (
    <ModuleGuard module="classes">
      <DashboardPagePlaceholder
        title="Gestion des classes"
        description="Créez et gérez les classes, niveaux et groupes d’élèves."
      />
    </ModuleGuard>
  );
}