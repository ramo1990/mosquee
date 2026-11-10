import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ScreenPreviewView from "@/components/screen-preview/ScreenPreviewView";

export default function ScreenPreviewPage() {
  return (
    <ModuleGuard module="screen-preview">
      <DashboardPagePlaceholder
        title="Prévisualisation des écrans"
        description="Visualisez l’affichage en temps réel de chaque écran avant diffusion."
      >
        <ScreenPreviewView />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}