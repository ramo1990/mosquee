import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import DonationsManagement from "@/components/donations/DonationsManagement";

export default function DonationsPage() {
  return (
    <ModuleGuard module="donations">
      <DashboardPagePlaceholder
        title="Dons"
        description="Consultez et gérez les dons reçus pour les projets et activités de la mosquée."
      >
        <DonationsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}