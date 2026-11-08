import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function LearningProgramsPage() {
  return (
    <ModuleGuard module="learning-programs">
      <DashboardPagePlaceholder
        title="Programmes d’apprentissage"
        description="Définissez les programmes, objectifs et contenus pédagogiques."
      />
    </ModuleGuard>
  );
}