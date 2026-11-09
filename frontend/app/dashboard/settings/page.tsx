import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import SettingsManagement from "@/components/settings/SettingsManagement";

export default function SettingsPage() {
  return (
    <ModuleGuard module="settings">
      <DashboardPagePlaceholder
        title="Paramètres"
        description="Configurez les informations générales, l’apparence et les préférences de l’application."
      >
        <SettingsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}