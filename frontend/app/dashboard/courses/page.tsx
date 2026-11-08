import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function CoursesPage() {
  return (
    <ModuleGuard module="courses">
      <DashboardPagePlaceholder
        title="Gestion des cours"
        description="Créez et organisez les cours, matières et séances d’enseignement."
      />
    </ModuleGuard>
  );
}