import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ContributionsManagement from "@/components/contributions/ContributionsManagement";

export default function ContributionsPage() {
  return (
    <ModuleGuard module="contributions">
      <DashboardPagePlaceholder
        title="Cotisations"
        description="Suivez les cotisations des fidèles, les échéances et l’historique des paiements."
      >
        <ContributionsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}