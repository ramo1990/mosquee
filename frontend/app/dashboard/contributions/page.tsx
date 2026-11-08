import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ContributionsPage() {
  return (
    <ModuleGuard module="contributions">
      <DashboardPagePlaceholder
        title="Cotisations"
        description="Suivez les cotisations des fidèles, les échéances et l’historique des paiements."
      />
    </ModuleGuard>
  );
}