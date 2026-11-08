import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function SlidesPage() {
  return (
    <ModuleGuard module="slides">
      <DashboardPagePlaceholder
        title="Gestion des diapositives"
        description="Créez et organisez les diapositives affichées sur les écrans."
      />
    </ModuleGuard>
  );
}