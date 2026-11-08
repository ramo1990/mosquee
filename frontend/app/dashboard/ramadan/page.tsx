import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function RamadanPage() {
  return (
    <ModuleGuard module="ramadan">
      <DashboardPagePlaceholder
        title="Programme Ramadan"
        description="Gérez les horaires du Suhoor, de l’Iftar, des Tarawih et des activités du mois de Ramadan."
      />
    </ModuleGuard>
  );
}