import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function DisplaySchedulePage() {
  return (
    <ModuleGuard module="display-schedule">
      <DashboardPagePlaceholder
        title="Programmation des affichages"
        description="Planifiez les contenus, horaires et priorités d’affichage sur les écrans."
      />
    </ModuleGuard>
  );
}