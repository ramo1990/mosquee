import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ScreensPage() {
  return (
    <ModuleGuard module="screens">
      <DashboardPagePlaceholder
        title="Écrans d’affichage"
        description="Gérez les écrans, leur statut, leurs groupes et les contenus diffusés."
      />
    </ModuleGuard>
  );
}