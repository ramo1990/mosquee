import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function StudentsPage() {
  return (
    <ModuleGuard module="students">
      <DashboardPagePlaceholder
        title="Gestion des élèves"
        description="Inscrivez, consultez et suivez les élèves de vos classes."
      />
    </ModuleGuard>
  );
}